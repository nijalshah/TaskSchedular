from flask import Flask, render_template, request, jsonify
import json

app = Flask(__name__)

# In-memory storage for tasks (this will reset when the server restarts)
tasks = []

@app.route('/')
def index():
    """Render the main page."""
    return render_template('index.html')


@app.route('/tasks', methods=['GET', 'POST'])
def handle_tasks():
    """Handle adding and getting tasks."""
    if request.method == 'GET':
        # Return the list of tasks as JSON
        return jsonify(tasks)
    
    if request.method == 'POST':
        # Get task data from the request
        data = request.get_json()
        title = data.get('title')
        date = data.get('date')
        completed = data.get('completed', False)

        # Create a new task
        new_task = {'title': title, 'date': date, 'completed': completed}
        tasks.append(new_task)

        return jsonify(new_task), 201


@app.route('/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    """Delete a task by its index in the tasks list."""
    if task_id < 0 or task_id >= len(tasks):
        return jsonify({'error': 'Task not found'}), 404
    
    deleted_task = tasks.pop(task_id)
    return jsonify(deleted_task), 200


@app.route('/tasks/complete', methods=['POST'])
def mark_task_complete():
    """Mark a task as completed by date."""
    data = request.get_json()
    task_date = data.get('date')
    task_title = data.get('title')
    
    for task in tasks:
        if task['date'] == task_date and task['title'] == task_title:
            task['completed'] = True
            return jsonify(task), 200

    return jsonify({'error': 'Task not found'}), 404


@app.route('/tasks/pending', methods=['POST'])
def mark_task_pending():
    """Mark a task as pending by date."""
    data = request.get_json()
    task_date = data.get('date')
    task_title = data.get('title')
    
    for task in tasks:
        if task['date'] == task_date and task['title'] == task_title:
            task['completed'] = False
            return jsonify(task), 200

    return jsonify({'error': 'Task not found'}), 404


if __name__ == '__main__':
    app.run(debug=True)
