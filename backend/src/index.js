const express = require('express');
const morgan = require('morgan');
const cors = require('cors');


//initializations
const app = express();

//middleware
app.use(express.urlencoded({ extended: false }));

//settings
app.set('port', process.env.PORT || 3000);

//middlewares
app.use(cors());
app.use(morgan('dev'));

//routes
app.use(require('./routes/estudiantes.routes'));

app.listen((app.get('port')), () => {
    console.log(`Server is running on port ${app.get('port')}`);
});