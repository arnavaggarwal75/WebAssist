# app/llm.py
import os
from dotenv import load_dotenv, find_dotenv
from langchain_openai import OpenAI
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.chains import RetrievalQA
from langchain_community.document_loaders import TextLoader
from langchain.output_parsers import PydanticOutputParser
from langchain_core.pydantic_v1 import BaseModel, Field, validator
from typing import List
from langchain.prompts import PromptTemplate


# Load environment variables
_ = load_dotenv(find_dotenv())

openai_api_key = os.getenv("OPENAI_API_KEY")

loader = TextLoader("./data.txt")
document = loader.load()

# Initialize the LLM with the API key
llm = OpenAI(temperature=0)

# Split the document into chunks
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=2500,
    chunk_overlap=400
)
chunks = text_splitter.split_documents(document)


# Perform embedding using FAISS
embeddings = OpenAIEmbeddings()
vector_db = FAISS.from_documents(chunks, embeddings)

QA_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=vector_db.as_retriever()
)

class FlashcardOutput(BaseModel):
        points: List[str] = Field(
            description="List of points for flashcards"
        )

        @validator('points', each_item=True)
        def end_with_dot(cls, info):
            for idx, item in enumerate(info):
                if item[-1] != ".":
                    info[idx] = info[idx][:-1]
            return info


def summarize_content(num_words):
    return QA_chain.invoke(f"generate a summary of this webpage content in roughly {num_words} words")

def flashcards():
    my_parser = PydanticOutputParser(
        pydantic_object=FlashcardOutput
    )
    prompt_template = """
    Offer a list of key points from this webpage content and ensure 
    that these points are not too long.

    {format_instructions}
    """
    my_prompt = PromptTemplate(
        template=prompt_template,
        partial_variables={
            "format_instructions": my_parser.get_format_instructions()
        }
    )
    formatted_prompt = my_prompt.format_prompt()
    output = QA_chain.invoke(formatted_prompt.to_string())
    print(output)

    return my_parser.parse(output)

def important_lines():
    pass

flashcards()