import React, { useState } from "react";
import styled from "@emotion/styled";
import { FaChevronDown } from "react-icons/fa";
import { useTranslation } from "next-i18next";

const FAQContainer = styled.div`
  background-color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  border-radius: 8px;
  color: black;
  width: 70%;
`;

const QuestionContainer = styled.div`
  padding: 1rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`;

const QuestionText = styled.h3`
  font-size: 1.25rem;
  margin: 0;
`;

const Answer = styled.div`
  padding: 8px 0;
  display: ${(props) => (props.isOpen ? "block" : "none")};
`;

const HorizontalLine = styled.div`
  border-bottom: 1px solid #ccc;
`;

const FAQAccordion = () => {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState(-1);

  const questions = [
    {
      question: t("index_faq_1_question"),
      answer: t("index_faq_1_answer"),
    },
    {
      question: t("index_faq_2_question"),
      answer: t("index_faq_2_answer"),
    },
    {
      question: t("index_faq_3_question"),
      answer: t("index_faq_3_answer"),
    },
    {
      question: t("index_faq_4_question"),
      answer: t("index_faq_4_answer"),
    },
    {
      question: t("index_faq_5_question"),
      answer: t("index_faq_5_answer"),
    },
  ];

  const toggleQuestion = (index) => {
    if (openIndex === index) {
      setOpenIndex(-1);
    } else {
      setOpenIndex(index);
    }
  };

  return (
    <FAQContainer>
      {questions.map((item, index) => (
        <React.Fragment key={index}>
          <QuestionContainer onClick={() => toggleQuestion(index)}>
            <QuestionText>{item.question}</QuestionText>
            <FaChevronDown
              style={{
                transform: openIndex === index ? "rotate(180deg)" : "none",
                transition: "transform 0.3s",
              }}
            />
          </QuestionContainer>
          <Answer isOpen={openIndex === index}>{item.answer}</Answer>
          {index != questions.length - 1 && <HorizontalLine />}
        </React.Fragment>
      ))}
    </FAQContainer>
  );
};

export default FAQAccordion;
