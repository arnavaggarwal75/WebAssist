import os
from dotenv import load_dotenv, find_dotenv
from langchain_openai import ChatOpenAI
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
llm = ChatOpenAI(temperature=0, model="gpt-4o")

# Split the document into chunks
text_splitter = RecursiveCharacterTextSplitter(
    separators = ["\n\n", "\n", " ", ""],    
    chunk_size = 1600,
    chunk_overlap= 200
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

def summarize_content(num_words):
    # messages = [
    # ("system",
    #     "You are responsible for summarizing a document",
    # ),
    # ("human", 
    #     f"generate a summary of this document in roughly {num_words} words"),
    # ]
    response = QA_chain.invoke(f"generate a summary of this document in roughly {num_words} words")
    return response["result"]

class FlashcardOutput(BaseModel):
    points: List[str] = Field(
        description="List of key points"
    )

def flashcards():
    my_parser = PydanticOutputParser(
        pydantic_object=FlashcardOutput
    )
    prompt_template = """
    Summarize the document in terms of key points which 
    we will display on flashcards later. Make sure the 
    points aren't too long.

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

class ImpLines(BaseModel):
    lines: List[str] = Field(
        description="List of important lines"
    )

def important_lines():
    my_parser = PydanticOutputParser(
    pydantic_object=ImpLines
    )

    prompt_template = """
    Imagine you are reading the document as a book and each time you read a line you add it to the list
    of returned lines if you think that it was an important piece of information. 
    Ensure that the lines are returned exactly as they appear in the document, without any changes, 
    including punctuation and spacing. The selected lines should be scattered throughout the document 
    to provide a coherent summary that allows a reader to skim through the content and understand the 
    key points and overall narrative. Aim to select lines from different sections of the document to 
    maintain a comprehensive overview. The average rate should at least be 1 in 6 lines. 

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
    lines_list = parsed_output.lines
    return lines_list

# Testing the functions
# print("Summary:")
# print(summarize_content(100))  

# print("\nFlashcards:")
# for item in flashcards():
#      print(item)

# print("\nAnswer Question:")
# print(answer_question("Which module does this documentation pertain to?"))

print("Impoortant Lines:")
for line in important_lines():
    print(line)