from flask import request, jsonify
from .langchain_model import *

def setup_routes(app):

    def save_content(content):
        data_file_path = 'data.txt'
        with open(data_file_path, 'w') as file:
            file.write(content)

    @app.route('/summarize', methods=['POST'])
    def summarize():
        data = request.json
        content = data.get('content')
        num_words = data.get('num_words', 200)
        if content:
            save_content(content)
            summary = summarize_content(num_words)
            return jsonify(summary)
        else:
            return jsonify({"error": "No content provided"}), 400

    @app.route('/flashcards', methods=['POST'])
    def generate_flashcards():
        data = request.json
        content = data.get('content')
        if content:
            save_content(content)
            flashcards_list = flashcards()
            return jsonify(flashcards_list)
        else:
            return jsonify({"error": "No content provided"}), 400

    @app.route('/answer', methods=['POST'])
    def answer():
        data = request.json
        content = data.get('content')
        question = data.get('question')
        if content:
            save_content(content)
            # answer = answer_question2(content ,question)
            answer = answer_question(question)
            return jsonify(answer)
        else:
            return jsonify({"error": "No content provided"}), 400

    @app.route('/skim', methods=['POST'])
    def important_lines():
        data = request.json
        content = data.get('content')
        if content:
            save_content(content)
            lines = extract_important_lines()
            return jsonify(lines)
        else:
            return jsonify({"error": "No content provided"}), 400
