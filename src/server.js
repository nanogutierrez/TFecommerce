import express from 'express';
import handlebars from 'express-handlebars';
import { __dirname } from './utils.js';
import productsRoutes from './routes/products.routes.js'
import viewsRoutes from './routes/views.routes.js'
import userRoutes from './routes/users.routes.js'
import sessionRoutes from './routes/sessions.routes.js'
import mongoose from 'mongoose';
import Handlebars from 'handlebars';
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access'
import initializePassport from './config/passport.config.js';
import passport from 'passport';
import config from './config/config.js';

const app = express();

// MongoDB local
mongoose.set('strictQuery', true);
mongoose.connect(config.MONGO_URI, (error) => {
  if(error) {
    console.log('Error al conectar a MongoDB', error);
  } else {
    console.log('Conectado a MongoDB');
  }
})

// Handlebars
app.engine('hbs', handlebars.engine({
  extname: '.hbs',
  defaultLayout: 'main.hbs',
  handlebars: allowInsecurePrototypeAccess(Handlebars)
}));

// Middlewares
app.set('view engine', 'hbs');
app.set('views', `${__dirname}/views`);
app.use(express.static(`${__dirname}/public`));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
initializePassport()
app.use(passport.initialize())

// Routes
app.use('/api/products', productsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/', viewsRoutes);

const transport = nodemailer.createTransport({
  service: 'gmail',
  port: 587,
  auth: {
    user: 'gutierrez.nano@gmail.com',
    pass: 'ycblksxwinnpgotx'
  }
})

app.get('/mail', async (req, res) => {
  const result = await transport.sendMail({
    from: 'coderhouse@gmail.com',
    to: 'gutierrez.nano@gmail.com',
    subject: "Mail verificado correctamente",
    html: `
      <div>
        <h1>Verificacion de mail</h1>
      </div>
    `,
    attachments: []
  })

  res.json({ result })
})

app.listen(config.PORT, () => { console.log(`Servidor escuchando en el puerto ${config.PORT}`) })