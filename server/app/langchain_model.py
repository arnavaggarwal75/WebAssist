import os
from dotenv import load_dotenv, find_dotenv
from langchain_openai import ChatOpenAI
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.chains import RetrievalQA
from langchain_community.document_loaders import TextLoader
from langchain.output_parsers import PydanticOutputParser
from langchain_core.pydantic_v1 import BaseModel, Field
from typing import List
from langchain.prompts import PromptTemplate
from langchain.chains.combine_documents.stuff import StuffDocumentsChain
from langchain.chains.llm import LLMChain


# Load environment variables
_ = load_dotenv(find_dotenv())
openai_api_key = os.getenv("OPENAI_API_KEY")

# Initialize the LLM with the API key
llm = ChatOpenAI(temperature=0, model="gpt-4o")

def load_doc():
    data_file_path = 'data.txt'
    loader = TextLoader(data_file_path)
    document = loader.load()
    return document

def summarize_content(num_words):
    document = load_doc()

    prompt_template = '''generate a summary of the following text in roughly {num} words:
                        "{text}"
                        '''

    my_prompt = PromptTemplate(
        template=prompt_template,
        input_variables={"num"}
    )

    llm_chain = LLMChain(llm=llm, prompt=my_prompt)

    # Define StuffDocumentsChain
    stuff_chain = StuffDocumentsChain(llm_chain=llm_chain, document_variable_name="text")
    response = stuff_chain.invoke({"input_documents": document, "num": num_words})

    return response["output_text"]

class FlashcardOutput(BaseModel):
    points: List[str] = Field(
        description="List of key points"
    )

def flashcards():
    document = load_doc()

    my_parser = PydanticOutputParser(
        pydantic_object=FlashcardOutput
    )

    prompt_template = """
    Summarize the following text in terms of key points which 
    we will display on flashcards later. Make sure the 
    points aren't too long.

    "{text}" 

    {format_instructions}
    """
    my_prompt = PromptTemplate(
        template=prompt_template,
        partial_variables={
            "format_instructions": my_parser.get_format_instructions()
        }
    )

    llm_chain = LLMChain(llm=llm, prompt=my_prompt)

    # Define StuffDocumentsChain
    stuff_chain = StuffDocumentsChain(llm_chain=llm_chain, document_variable_name="text")
    output = stuff_chain.invoke(document)

    parsed_output = my_parser.parse(output["output_text"])
    points_list = parsed_output.points
    return [item.rstrip(".") for item in points_list]

class ImpLines(BaseModel):
    lines: List[str] = Field(
        description="List of important lines"
    )

def extract_important_lines():
    document = load_doc()

    my_parser = PydanticOutputParser(
        pydantic_object=ImpLines
    )

    # Define prompt
    prompt_template = """
    Identify the important lines in the following text that capture the main 
    idea and flow of the content. Start from the beginning of the text 
    and ensure that the lines are returned exactly as they appear in the 
    text, without any changes, including punctuation and spacing. 
    The selected lines should be scattered throughout the text to 
    provide a coherent summary that allows a reader to skim through the 
    content and understand the key points and overall narrative. Aim to 
    select lines from different sections of the text in a sequential 
    order to maintain a comprehensive overview.
    If there are quotes within the text, escape it with the backslash. 

    "{text}" 

    {format_instructions}
    """
    my_prompt = PromptTemplate(
        template=prompt_template,
        partial_variables={
            "format_instructions": my_parser.get_format_instructions()
        }
    )

    llm_chain = LLMChain(llm=llm, prompt=my_prompt)

    # Define StuffDocumentsChain
    stuff_chain = StuffDocumentsChain(llm_chain=llm_chain, document_variable_name="text")

    output = stuff_chain.invoke(document)
    parsed_output = my_parser.parse(output["output_text"])
    lines_list = parsed_output.lines
    return lines_list

def answer_question(ques):
    document = load_doc()
    
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

    return (QA_chain.invoke(f'''
    Answer the following question with reference to the this document:
    {ques}'''))["result"]


# Testing the functions
# print("Summary:")
# print(summarize_content(100))  

# print("\nFlashcards:")
# for item in flashcards():
#      print(item)

# print("Impoortant Lines:")
# for line in extract_important_lines():
#     print(line)

# print("\nAnswer Question:")
# print(answer_question("How does the OED define a mummy?"))


# import nltk
# from nltk.tokenize import sent_tokenize
# # Ensure nltk punkt tokenizer is downloaded
# nltk.download('punkt')

# def sentence_aware_chunking(input_text, max_len):
#     sentences = sent_tokenize(input_text)
#     chunks = []
#     current_chunk = []
#     current_len = 0

#     for sentence in sentences:
#         if current_len + len(sentence) > max_len:
#             chunks.append(' '.join(current_chunk))
#             current_chunk = [sentence]
#             current_len = len(sentence)
#         else:
#             current_chunk.append(sentence)
#             current_len += len(sentence)

#     if current_chunk:
#         chunks.append(' '.join(current_chunk))
    
#     return chunks

# def answer_question2(text, ques):
#     # Split the document into sentence-aware chunks
#     chunks = sentence_aware_chunking(text, 1600)
#     print(f"Document split into {len(chunks)} chunks")
#     for i, chunk in enumerate(chunks):
#         print(f"Chunk {i+1}: {chunk}...") 


#     # Perform embedding using FAISS
#     embeddings = OpenAIEmbeddings()
#     vector_db = FAISS.from_texts(chunks, embeddings)

#     QA_chain = RetrievalQA.from_chain_type(
#         llm=llm,
#         chain_type="stuff",
#         retriever=vector_db.as_retriever()
#     )

#     result = QA_chain.invoke(f'''
#     Answer the following question with reference to this document:
#     {ques}''')

#     return result["result"]

# # Example usage for testing
# # print(answer_question("How does the OED define a mummy?"))