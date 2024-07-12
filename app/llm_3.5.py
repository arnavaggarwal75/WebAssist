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
    chunk_size=1800,
    chunk_overlap=350
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
            description="List of key points"
        )

def summarize_content(num_words):
    return (QA_chain.invoke(f"generate a summary of this document in roughly {num_words} words"))["result"]

def flashcards():
    my_parser = PydanticOutputParser(
        pydantic_object=FlashcardOutput
    )
    prompt_template = """
    Summarize the document in terms of key points which 
    we will display on flashcards later.

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
    
    parsed_output = my_parser.parse(output["result"])
    points_list = parsed_output.points

    return [item.rstrip(".") for item in points_list]

def answer_question(ques):
    return (QA_chain.invoke(f'''
    Answer the following question with reference to the this document:
    {ques}'''))["result"]

# Testing the functions
print("Summary:")
print(summarize_content(100))  

print("\nFlashcards:")
for item in flashcards():
     print(item)

print("\nAnswer Question:")
print(answer_question("How did the word car origniate?"))