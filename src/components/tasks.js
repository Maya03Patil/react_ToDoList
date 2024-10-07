import React, { useState, useEffect } from 'react';
import './tasks.css';
import {
    AppBar,
    Toolbar,
    Typography,
    TextField,
    Button,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Container,
    Box,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import Pagination from '@mui/lab/Pagination';

function Tasks() {
    const [task, setTask] = useState('');
    const [date, setDate] = useState('');
    const [tasks, setTasks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [tasksPerPage] = useState(5);

    // Load tasks from localStorage on component mount
    useEffect(() => {
        const storedTasks = JSON.parse(localStorage.getItem('tasks'));
        if (storedTasks) {
            setTasks(storedTasks);
        }
    }, []);

    // Save tasks to localStorage whenever tasks change
    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]);

    const addTask = () => {
        if (task && date) {
            const newTask = { id: Date.now(), task, date };
            setTasks([...tasks, newTask]);
            setTask('');
            setDate('');
        }
    };

    const deleteTask = (id) => {
        const updatedTasks = tasks.filter((task) => task.id !== id);
        setTasks(updatedTasks);
    };

    const editTask = (id) => {
        const taskToEdit = tasks.find((task) => task.id === id);
        setTask(taskToEdit.task);
        setDate(taskToEdit.date);
        deleteTask(id);
    };

    const filteredTasks = tasks.filter((task) =>
        task.task.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination Logic
    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);
    const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

    return (
        <Container maxWidth="md" style={{ marginTop: '2rem' }}>
            {/* Navbar */}
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        To-Do List App
                    </Typography>
                </Toolbar>
            </AppBar>

            <Typography variant="h4" align="center" gutterBottom>
                To-Do List
            </Typography>
            
            {/* Search Field */}
            <TextField
                label="Search Tasks"
                variant="outlined"
                fullWidth
                margin="normal"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={2}>
                <Box flexGrow={1}>
                    <TextField
                        label="Enter task"
                        variant="outlined"
                        fullWidth
                        value={task}
                        onChange={(e) => setTask(e.target.value)}
                    />
                </Box>
                <Box flexGrow={1}>
                    <TextField
                        type="date"
                        variant="outlined"
                        fullWidth
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </Box>
                <Box>
                    <Button variant="contained" color="primary" onClick={addTask}>
                        Add Task
                    </Button>
                </Box>
            </Box>

            {/* Task List */}
            <List style={{ marginTop: '2rem' }}>
                {currentTasks.map((task) => (
                    <ListItem key={task.id} divider>
                        <ListItemText primary={`${task.task} - ${task.date}`} />
                        <span>
                            <IconButton onClick={() => editTask(task.id)}>
                                <FontAwesomeIcon icon={faEdit} className="text-primary" />
                            </IconButton>
                            <IconButton onClick={() => deleteTask(task.id)}>
                                <FontAwesomeIcon icon={faTrash} className="text-danger" />
                            </IconButton>
                        </span>
                    </ListItem>
                ))}
            </List>

            {/* Pagination */}
            <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(event, value) => setCurrentPage(value)}
                variant="outlined"
                color="primary"
                style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center' }}
            />
        </Container>
    );
}

export default Tasks;
