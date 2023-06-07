import { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Button,
    TextareaAutosize,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControlLabel,
    Switch,
    Typography,
    ListItem,
    ListItemText,
    List,
    Paper,
    createTheme,
    ThemeProvider,
} from '@mui/material';
import { useSession } from 'next-auth/react';
const theme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#ff5722',
      },
    },
  });
  
const AdminPage = () => {
    const {data: session} = useSession();
    const isAdmin = session?.token?.email == "nsu.turag@gmail.com";
    const [users, setUsers] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [searchUserInput, setSearchUserInput] = useState('');
    const [searchQuestionInput, setSearchQuestionInput] = useState('');
    const [editUserModal, setEditUserModal] = useState(false);
    const [editQuestionModal, setEditQuestionModal] = useState(false);
    const [editUserId, setEditUserId] = useState('');
    const [editUserName, setEditUserName] = useState('');
    const [editUserEmail, setEditUserEmail] = useState('');
    const [editUserActive, setEditUserActive] = useState('');
    const [editUserRespectPoints, setEditUserRespectPoints] = useState('');
    const [editQuestionId, setEditQuestionId] = useState('');
    const [editQuestionTitle, setEditQuestionTitle] = useState('');
    const [editQuestionTags, setEditQuestionTags] = useState('');
    const [editQuestionBody, setEditQuestionBody] = useState('');
    const [editQuestionUpvotes, setEditQuestionUpvotes] = useState('');
    const [editQuestionEarnings, setEditQuestionEarnings] = useState('');
    const [editQuestionProblemStatus, setEditQuestionProblemStatus] = useState('');
    const [editAnswerId, setEditAnswerId] = useState('');
    const [editAnswerUserId, setEditAnswerUserId] = useState('');
    const [editAnswerBody, setEditAnswerBody] = useState('');
    const [editAnswerUpvotes, setEditAnswerUpvotes] = useState('');
    const [editAnswerEarnings, setEditAnswerEarnings] = useState('');

    // Fetch all users
    const fetchUsers = () => {
        fetch('/api/admin/users')
            .then((response) => response.json())
            .then((data) => setUsers(data))
            .catch((error) => console.error(error));
    };

    // Fetch all questions
    const fetchQuestions = () => {
        fetch('/api/admin/questions')
            .then((response) => response.json())
            .then((data) => setQuestions(data))
            .catch((error) => console.error(error));
    };

    // Delete a user by ID
    const deleteUser = (id) => {
        fetch(`/api/admin/users/${id}`, { method: 'DELETE' })
            .then(() => fetchUsers())
            .catch((error) => console.error(error));
    };

    // Delete a question by ID
    const deleteQuestion = (id) => {
        fetch(`/api/admin/questions/${id}`, { method: 'DELETE' })
            .then(() => fetchQuestions())
            .catch((error) => console.error(error));
    };

    // Search users by name
    const searchUsers = () => {
        fetch(`/api/admin/users?name=${searchUserInput}`)
            .then((response) => response.json())
            .then((data) => setUsers(data))
            .catch((error) => console.error(error));
    };

    // Search questions by title
    const searchQuestions = () => {
        fetch(`/api/admin/questions?title=${searchQuestionInput}`)
            .then((response) => response.json())
            .then((data) => setQuestions(data))
            .catch((error) => console.error(error));
    };

    // Edit user (update name, email, active, respectPoints)
    const editUser = () => {
        fetch(`/api/admin/users/${editUserId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: editUserName,
                email: editUserEmail,
                active: editUserActive,
                respectPoints: editUserRespectPoints,
            }),
        })
            .then(() => {
                fetchUsers();
                setEditUserModal(false);
            })
            .catch((error) => console.error(error));
    };

    // Edit question (update title, tags, body, upvotes, earnings, problemStatus)
    const editQuestion = () => {
        fetch(`/api/admin/questions/${editQuestionId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: editQuestionTitle,
                tags: editQuestionTags,
                body: editQuestionBody,
                upvotes: editQuestionUpvotes,
                earnings: editQuestionEarnings,
                problemStatus: editQuestionProblemStatus,
            }),
        })
            .then(() => {
                fetchQuestions();
                setEditQuestionModal(false);
            })
            .catch((error) => console.error(error));
    };

    const editAnswer = () => {
        fetch(`/api/admin/questions/${editQuestionId}/answers/${editAnswerId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                body: editAnswerBody,
                upvotes: editAnswerUpvotes,
                earnings: editAnswerEarnings,
            }),
        })
            .then(() => {
                fetchQuestions();
                setEditAnswerId('');
                setEditAnswerUserId('');
                setEditAnswerBody('');
                setEditAnswerUpvotes('');
                setEditAnswerEarnings('');
            })
            .catch((error) => console.error(error));
    };
    
    
    return isAdmin&&(
        <ThemeProvider theme={theme}>
            <div>
            <Typography variant="h2" gutterBottom>Users</Typography>
                <TextField
                    type="text"
                    value={searchUserInput}
                    onChange={(e) => setSearchUserInput(e.target.value)}
                    placeholder="Search by name"
                />
                <Button variant="contained" color="primary" onClick={searchUsers}>
                    Search Users
                </Button>
                <Button variant="contained" color="primary" onClick={fetchUsers}>
                    Show All Users
                </Button>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Active</TableCell>
                                <TableCell>Respect Points</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.id}</TableCell>
                                    <TableCell>
                                        {editUserModal && editUserId === user.id ? (
                                            <TextField
                                                type="text"
                                                value={editUserName}
                                                onChange={(e) => setEditUserName(e.target.value)}
                                            />
                                        ) : (
                                            user.name
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {editUserModal && editUserId === user.id ? (
                                            <TextField
                                                type="email"
                                                value={editUserEmail}
                                                onChange={(e) => setEditUserEmail(e.target.value)}
                                            />
                                        ) : (
                                            user.email
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {editUserModal && editUserId === user.id ? (
                                            <TextField
                                                type="text"
                                                value={editUserActive}
                                                onChange={(e) => setEditUserActive(e.target.value)}
                                            />
                                        ) : (
                                            user.active
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {editUserModal && editUserId === user.id ? (
                                            <TextField
                                                type="text"
                                                value={editUserRespectPoints}
                                                onChange={(e) => setEditUserRespectPoints(e.target.value)}
                                            />
                                        ) : (
                                            user.respectPoints
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {editUserModal && editUserId === user.id ? (
                                            <div>
                                                <Button variant="contained" color="primary" onClick={editUser}>
                                                    Save
                                                </Button>
                                                <Button variant="contained" color="secondary" onClick={() => setEditUserModal(false)}>
                                                    Cancel
                                                </Button>
                                            </div>
                                        ) : (
                                            <div>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => {
                                                        setEditUserId(user.id);
                                                        setEditUserName(user.name);
                                                        setEditUserEmail(user.email);
                                                        setEditUserActive(user.active);
                                                        setEditUserRespectPoints(user.respectPoints);
                                                        setEditUserModal(true);
                                                    }}
                                                >
                                                    Edit
                                                </Button>
                                                <Button variant="contained" color="secondary" onClick={() => deleteUser(user.id)}>
                                                    Delete
                                                </Button>
                                            </div>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Typography variant="h2" gutterBottom>Questions</Typography>
                <TextField
                    type="text"
                    value={searchQuestionInput}
                    onChange={(e) => setSearchQuestionInput(e.target.value)}
                    placeholder="Search by title"
                />
                <Button variant="contained" color="primary" onClick={searchQuestions}>
                    Search Questions
                </Button>
                <Button variant="contained" color="primary" onClick={fetchQuestions}>
                    Show All Questions
                </Button>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Title</TableCell>
                                <TableCell>Tags</TableCell>
                                <TableCell>Body</TableCell>
                                <TableCell>Upvotes</TableCell>
                                <TableCell>Earnings</TableCell>
                                <TableCell>Problem Status</TableCell>
                                <TableCell>Answers</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {questions.map((question) => (
                                <TableRow key={question.id}>
                                    <TableCell>{question.id}</TableCell>
                                    <TableCell>
                                        {editQuestionModal && editQuestionId === question.id ? (
                                            <TextField
                                                type="text"
                                                value={editQuestionTitle}
                                                onChange={(e) => setEditQuestionTitle(e.target.value)}
                                            />
                                        ) : (
                                            question.title
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {editQuestionModal && editQuestionId === question.id ? (
                                            <TextField
                                                type="text"
                                                value={editQuestionTags}
                                                onChange={(e) => setEditQuestionTags(e.target.value)}
                                            />
                                        ) : (
                                            question.tags
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {editQuestionModal && editQuestionId === question.id ? (
                                            <TextareaAutosize
                                                value={editQuestionBody}
                                                onChange={(e) => setEditQuestionBody(e.target.value)}
                                                rowsMin={3}
                                            />
                                        ) : (
                                            question.body
                                        )}
                                    </TableCell>
                                    <TableCell>{question.upvotes}</TableCell>
                                    <TableCell>{question.earnings}</TableCell>
                                    <TableCell>{question.problemStatus}</TableCell>
                                    <TableCell>
                                        {question.answers.length > 0 ? (
                                            <List>
                                                {question.answers.map((answer) => (
                                                    <ListItem key={answer.id}>
                                                        <ListItemText primary={answer.text} />
                                                    </ListItem>
                                                ))}
                                            </List>
                                        ) : (
                                            'No answers yet'
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {editQuestionModal && editQuestionId === question.id ? (
                                            <div>
                                                <Button variant="contained" color="primary" onClick={editQuestion}>
                                                    Save
                                                </Button>
                                                <Button variant="contained" color="secondary" onClick={() => setEditQuestionModal(false)}>
                                                    Cancel
                                                </Button>
                                            </div>
                                        ) : (
                                            <div>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => {
                                                        setEditQuestionId(question.id);
                                                        setEditQuestionTitle(question.title);
                                                        setEditQuestionTags(question.tags);
                                                        setEditQuestionBody(question.body);
                                                        setEditQuestionModal(true);
                                                    }}
                                                >
                                                    Edit
                                                </Button>
                                                <Button variant="contained" color="secondary" onClick={() => deleteQuestion(question.id)}>
                                                    Delete
                                                </Button>
                                            </div>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </ThemeProvider>
    );
}

export default AdminPage;
