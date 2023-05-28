import json
import os
import random
from argparse import ArgumentParser
from datetime import datetime
from typing import Tuple, List, Dict, Optional

import PIL
import dateutil.tz
import pandas as pd

import torch
import clip
from PIL import Image
from torchvision.datasets import VisionDataset
from multilingual_clip import pt_multilingual_clip
import transformers
from tqdm import tqdm

import utils
from backend.geo import CenterFilter
from utils import mkdir_p


def chunks(lst, n):
    """Yield successive n-sized chunks from lst."""
    for i in range(0, len(lst), n):
        yield lst[i:i + n]


def get_bruggen_df(path):
    bruggen_df = pd.read_csv(os.path.join(path, 'bruggen-gent.csv'), on_bad_lines='skip', sep=';')
    locations = bruggen_df['geo_point_2d']
    titles = bruggen_df['naam']
    text = bruggen_df["naam"] + ' over de ' + bruggen_df["kruising_met"]
    out = pd.concat({'title': titles, 'text': text, 'location': locations}, axis=1)
    return out


def get_cafes_df(path):
    bruggen_df = pd.read_csv(os.path.join(path, 'cafes-gent.csv'), on_bad_lines='skip', sep=';')
    locations = bruggen_df['geo_point_2d']
    titles = bruggen_df['name_nl']
    text = bruggen_df[['name_nl', 'description_nl']].agg(' - '.join, axis=1)
    out = pd.concat({'title': titles, 'text': text, 'location': locations}, axis=1)
    return out


def get_parken_df(path):
    bruggen_df = pd.read_csv(os.path.join(path, 'parken-gent.csv'), on_bad_lines='skip', sep=';')
    locations = bruggen_df['geo_point_2d']
    titles = bruggen_df['naam']
    text = 'Park ' + bruggen_df[['naam']].agg(' - '.join, axis=1)
    out = pd.concat({'title': titles, 'text': text, 'location': locations}, axis=1)
    return out


def get_straten_df(path):
    bruggen_df = pd.read_csv(os.path.join(path, 'straten-gent.csv'), on_bad_lines='skip', sep=';')
    bruggen_df = bruggen_df[pd.notna(bruggen_df['naam'])]
    locations = bruggen_df['geo_point_2d']
    titles = bruggen_df['naam']
    # text = bruggen_df[['naam']].astype(str).agg(' - '.join, axis=1)
    text = bruggen_df[['naam']].astype(str).agg(' - '.join, axis=1)
    out = pd.concat({'title': titles, 'text': text, 'location': locations}, axis=1)
    return out


def get_erfgoed_df(path):
    bruggen_df = pd.read_csv(os.path.join(path, 'vastgesteld-bouwkundig-erfgoed-gent.csv'), on_bad_lines='skip', sep=';')
    bruggen_df = bruggen_df[pd.notna(bruggen_df['naam'])]
    locations = bruggen_df['geo_point_2d']
    titles = bruggen_df['naam']
    # text = bruggen_df[['naam']].astype(str).agg(' - '.join, axis=1)
    text = bruggen_df['type_naam'] + ': ' + bruggen_df['naam'] + ' te ' + bruggen_df['locatie']
    out = pd.concat({'title': titles, 'text': text, 'location': locations}, axis=1)
    return out


def get_kunst_df(path):
    raise NotImplementedError
    bruggen_df = pd.read_csv(os.path.join(path, 'gent-kunst-op-straat.csv'), on_bad_lines='skip', sep=';')
    bruggen_df = bruggen_df[pd.notna(bruggen_df['naam'])]
    locations = bruggen_df['geo_point_2d']
    titles = bruggen_df['naam']
    # text = bruggen_df[['naam']].astype(str).agg(' - '.join, axis=1)
    text = bruggen_df['type_naam'] + ': ' + bruggen_df['naam'] + ' te ' + bruggen_df['locatie']
    out = pd.concat({'title': titles, 'text': text, 'location': locations}, axis=1)
    return out


def read_csvs(path):
    # files = [
    #     # /export/home2/NoCsBack/working/rubenc/OUAI-Gent/data/
    #     'bruggen-gent.csv',
    #     'cafes-gent.csv',
    #     # 'erfgoedobjecten.csv',
    #     # 'locations.csv',
    #     'parken-gent.csv',
    #     'speelterreinen-gent.csv',
    #     'straten-gent.csv',
    #     # 'stratenlijst.csv',
    #     'vastgesteld-bouwkundig-erfgoed-gent.csv',
    #     'gent-kunst-op-straat.csv',
    # ]

    all_df = pd.DataFrame(columns=['title', 'text', 'location'])
    all_df = pd.concat([all_df, get_bruggen_df(path)])
    all_df = pd.concat([all_df, get_cafes_df(path)])
    all_df = pd.concat([all_df, get_parken_df(path)])
    all_df = pd.concat([all_df, get_straten_df(path)])
    all_df = pd.concat([all_df, get_erfgoed_df(path)])
    # todo: https://data.stad.gent/explore/dataset/gent-kunst-op-straat/information/
    # all_df = all_df.append(get_kunst_df(path))
    return all_df[
        pd.notna(all_df['title']) & pd.notna(all_df['text']) & pd.notna(all_df['location'])
    ].reset_index()


class ImageDataset(VisionDataset):
    def __init__(self, root, preprocess):
        super().__init__(root)
        self.imgs = os.listdir(root)
        self.preprocess = preprocess

    def __getitem__(self, item):
        img_file = self.imgs[item]
        with open(os.path.join(self.root, img_file), "rb") as f:
            try:
                img = Image.open(f)
                return img_file, self.preprocess(img)  # .convert("RGB")
            except PIL.UnidentifiedImageError as e:
                print(e)
                print('Image file gave error: %s' % img_file)
                return self[item + 1]

    def __len__(self):
        return len(self.imgs)


def run():
    # https://github.com/openai/CLIP
    # https://github.com/FreddeFrallan/Multilingual-CLIP

    args = parse_args()

    df = read_csvs(args.csv_path)

    device = "cuda" if torch.cuda.is_available() else "cpu"
    clip_model, preprocess = clip.load("ViT-B/32", device=device, download_root=args.cache_dir)

    ds = ImageDataset(args.img_path, preprocess)
    dl = torch.utils.data.DataLoader(ds,
                                     batch_size=args.batch_size,
                                     pin_memory=True,
                                     num_workers=args.num_workers if not args.debug else 0,
                                     drop_last=False,
                                     shuffle=False,
                                     # collate_fn=r_prec_ds.collate,
                                     )
    # print(ds[0])
    b = next(iter(dl))
    # print(b[0], b[1].shape)

    txt_model = pt_multilingual_clip.MultilingualCLIP.from_pretrained(args.text_model_name, cache_dir=args.cache_dir)
    txt_model = txt_model.to(device)
    tokenizer = transformers.AutoTokenizer.from_pretrained(args.text_model_name, cache_dir=args.cache_dir)


    with torch.no_grad():

        txt_embs = []
        for i, txt_batch in tqdm(enumerate(chunks(df.text.to_list(), args.batch_size))):

            txt_tok = tokenizer(txt_batch, padding=True, return_tensors='pt')
            att, inp_ids = txt_tok['attention_mask'].to(device), txt_tok['input_ids'].to(device)
            embs = txt_model.transformer(inp_ids, att)[0]
            embs = (embs * att.unsqueeze(2)).sum(dim=1) / att.sum(dim=1)[:, None]
            embs = txt_model.LinearTransformation(embs)

            txt_embs.append(embs)
            if args.debug and i > 10: break
        txt_embs = torch.concat(txt_embs).to(device).half()
        txt_embs /= txt_embs.norm(dim=-1, keepdim=True)

        max_match_idcs, max_match_vals = [], []
        all_names = []
        for i, img_batch in tqdm(enumerate(dl)):
            names, images = img_batch
            images = images.to(device)
            image_features = clip_model.encode_image(images)
            image_features /= image_features.norm(dim=-1, keepdim=True)
            similarity = (100.0 * image_features @ txt_embs.T).softmax(-1)
            # print(similarity)
            values, indices = similarity.topk(5)
            all_names += names
            max_match_idcs.append(indices.cpu())
            max_match_vals.append(values.cpu())
            if args.debug and i > 10: break

        max_match_idcs = torch.concat(max_match_idcs)
        max_match_vals = torch.concat(max_match_vals)

        mask = max_match_vals[:, 0] > args.threshold
        matched_idcs = max_match_idcs[:, 0][mask]
        matched_names = [n for (n, m) in zip(all_names, mask) if m]
        matched_obj_ids = [n.strip('.jpg') for n in matched_names]
        matches = {
            oid: df.iloc[i.item()].to_dict() for (oid, i) in zip(matched_obj_ids, matched_idcs)
        }

        payloads(args, matches)
        print('done')


def payloads(args, matches):
    with open(args.json_path) as f:
        dsets = json.load(f)
    all_objs = [(oid, obj) for dct in dsets.values() for (oid, obj) in dct.items()]

    center_filter = CenterFilter(shp_file=args.stadswijken_shp)

    pls = []
    matched_ids = set(matches.keys())
    for i, (obj_id, obj) in tqdm(enumerate(sorted(all_objs, key=lambda x: random.random()))):
        if obj_id in matched_ids:
            payload = clip_payload_from_object(obj_id, obj, matches[obj_id], center_filter)
            if payload is not None:
                pls.append(payload)

    p = os.path.join(args.output_dir, 'clip_payloads.json')
    with open(p, 'w') as f:
        json.dump(pls, f)
    print('saved payloads to %s' % p)


def clip_payload_from_object(obj_id: str, obj: Dict, match: Dict, center_filter: CenterFilter) -> Optional[Dict]:
    try:
        title = obj['MensgemaaktObject.titel']['@value']
        desc = obj.get('Entiteit.beschrijving', {}).get('@value', '')
        coords = match['location'].split(',')
        coords = [float(c) for c in coords]     # first lat, then long
        img_url = utils.get_img_url_from_obj(obj, image_width=400)
        explanation = 'Het CLIP AI model heeft dit object gelinkt met deze locatie: "%s"' % match['text']
        payload_desc = desc + '\n' + explanation

        payload = {
            "object_id": obj_id,
            "title": title,
            "coordinates": coords,
            "description": payload_desc,
            "address": match['title'],
            "image_url": img_url,
            "location_link": 'CLIP',
            "in_center": center_filter(coords),
            # "tags": ["19e eeuw", "lol"]
        }
        return payload
    except Exception as e:
        print(e)
        # raise e
        return None


def parse_args():
    p = ArgumentParser()
    p.add_argument('--debug', action='store_true')
    p.add_argument('--output_dir', type=str, default='/export/home2/NoCsBack/working/rubenc/OUAI-Gent/output/')
    p.add_argument('--run_name', type=str, default='clip')
    p.add_argument('--batch_size', type=int, default=50,)
    p.add_argument('--num_workers', type=int, default=10,)
    p.add_argument('--threshold', type=float, default=0.20,)
    p.add_argument('--text_model_name', type=str, default='M-CLIP/XLM-Roberta-Large-Vit-B-32',)

    csv_path = '/export/home2/NoCsBack/working/rubenc/OUAI-Gent/data/'
    img_path = '/export/home2/NoCsBack/working/rubenc/OUAI-Gent/images/'
    p.add_argument('--img_path', type=str, default=img_path)
    p.add_argument('--csv_path', type=str, default=csv_path)
    obj_path = '/cw/liir/NoCsBack/testliir/rubenc/OUAI-pt2/LDES-API/api_exploration/output/most_recent_objects_v2.json'
    p.add_argument('--json_path', type=str, default=obj_path)
    shp_file = "/cw/liir/NoCsBack/testliir/rubenc/OUAI-pt2/stadswijken-gent/stadswijken-gent.shp"
    p.add_argument('--stadswijken_shp', type=str, default=shp_file)

    p.add_argument('--cache_dir', type=str, default='/export/home2/NoCsBack/working/rubenc/OUAI-Gent/cache/clip/')
    args = p.parse_args()
    now = datetime.now(dateutil.tz.tzlocal())
    timestamp = now.strftime('%Y_%m_%d_%H_%M_%S')
    output_dir = os.path.join(args.output_dir, "%s_%s" % (timestamp, args.run_name))
    args.output_dir = output_dir
    mkdir_p(args.output_dir)
    return args


if __name__ == '__main__':
    """
        This file computes matches between object images and locations in Gent with CLIP.
        You need to
            - install clip, multilingual_clip, transformers, pytorch, torchvision
            - download the images with the download_images.py script and set --img_path to the folder where you
                download them
            - download location csv files from https://data.stad.gent/explore/ (and set --csv_path):
                - bruggen-gent.csv
                - cafes-gent.csv
                - parken-gent.csv
                - straten-gent.csv
                - vastgesteld-bouwkundig-erfgoed-gent.csv
    """
    run()
