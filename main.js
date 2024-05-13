const express = require("express");
const app = express();
const port = 3000;
const session = require("express-session");
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");

const mongoURI = "My access URI"; //Password

// Nombre de la base de datos
const dbName = "UltimateMaker"; // Database to connect

mongoose.connect(`${mongoURI}${dbName}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

//MongoDB uses a limit of 16MB per document, so to prevent possible errors, we prevent any upload that surpases that limit.
app.use(express.json({ limit: "16mb" }));

// Creating a cookie when required and encrypting it.
app.use(
    session({
        secret: "omniman",
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({ mongoUrl: `${mongoURI}${dbName}` }),
    }),
);

// Redirecting users that have not been logged.

app.use("/collections.html", (req, res, next) => {
    if (!req.session.user) {
        return res.redirect("/login.html");
    }
    next();
});

app.use("/login.html", (req, res, next) => {
    if (req.session.user) {
        return res.redirect("/index.html");
    }
    next();
});

// Schemas for database documents.

const cardSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    render: String,
    name: String,
    type: Number,
    color: Number,
});

const userSchema = new mongoose.Schema({
    email: String,
    nickname: String,
    password: String,
    isPro: {
        type: Boolean,
        default: false
    },
    creationDate: {
        type: Date,
        default: new Date,
    }
});

const skillSchema = new mongoose.Schema({
    name: String,
    desc: String,
    power: Number,
    color: Number,
    type: Number,
    img: String,
});

const bannerSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    color: {
        type: String,
        default: "#FFFFFF"
    },
    bgColor: {
        type: String,
        default: "#524AA6"
    },
    backgroundImg: String,
    profileImg: String,
});

const deckSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    num: Number,
    portrait: String,
    cards: [mongoose.Schema.Types.ObjectId],
});

//Storing schemas and assigning them to a collection.

const CARD = mongoose.model("cards", cardSchema);

const USER = mongoose.model("users", userSchema);

const SKILL = mongoose.model("skills", skillSchema);

const BANNER = mongoose.model("banners", bannerSchema);

const DECKS = mongoose.model("decks", deckSchema);


// Obtain an array of card IDs for the selected user deck.
app.post("/get-deck-cards", async (req, res) => {
    console.log("Intento de obtener cartas de un mazo...");

    if (req.session.user) {
        try {

            req.body.search.userId = req.session.user.userId;
            const deck = await DECKS.findOne(req.body.search);

            let cards = [];

            for (let i = 0; i < deck.cards.length; i++) {
                cards.push(await CARD.find({ _id: deck.cards[i], ...req.body.filter }));
            }
            console.log(cards);
            res.json(cards);

        } catch (e) {
            console.error("Error al registrar el usuario: ", e);

            res.status(500).send("Internal server error!");
        }
    }
});

//Endpoint to register user into the database. We create the user and we assign it a default profile banner.

app.post("/register", async (req, res) => {
    console.log("Intento de registro recibido!");

    let userData = req.body;

    const userExists = await USER.findOne({ email: userData.email });

    if (userExists) {
        console.log("Error: este usuario ya existe!");
        return res.status(409).send("This user already exists!");
    }

    try {
        userData.nickname = userData.email.substring(0, userData.email.indexOf('@'));

        const newUser = new USER(userData);

        await newUser.save();

        const newBanner = new BANNER({ userId: newUser._id });

        newBanner.save();

        console.log("Usuario registrado correctamente!");

        req.session.user = {
            userId: newUser._id
        };

        res.status(200).send();

    } catch (e) {
        console.error("Error al registrar el usuario: ", e);

        res.status(500).send("Internal server error!");
    }
});

//Only 1 response per time. Remember, AJAX is the key of why it didnt work at first.

/*
We check if the user exists in the users collection, if the user exists and the data sent is correct, we
assign a cookie to the users browser and we let him enter his profile page.
*/
app.post("/login", async (req, res) => {
    console.log("Intento de login recibido!");

    let userData = req.body;

    const userDocument = await USER.findOne({ email: userData.email });

    if (!userDocument) {
        console.log("Error: este usuario no existe!");
        return res.status(404).send('Incorrect username or password!');
    }

    if (userData.password === userDocument.password) {
        console.log(`Usuario '${userDocument.email}' encontrado con contraseña '${userDocument.password}'`);

        req.session.user = {
            userId: userDocument._id
        };

        console.log("Sesion creada!");
        res.status(200).send();
    } else {
        console.log("Usuario existe, pero contraseña incorrecta!");
        res.status(404).send('Incorrect username or password!');
    }
});

// We destroy the cookie the user has when he's already logged.

app.post("/logout", (req, res) => {
    console.log("Intento de cierre de sesión recibido!");

    req.session.destroy((err) => {
        if (err) {
            console.error("Error al cerrar sesión:", err);
            res.status(200).send(true);
        } else {
            console.log("Sesión cerrada con éxito!");
            res.status(200).send(false);
        }
    });
});

// We check if the user has a cookie, checking if it's logged or not.

app.post("/is-logged", (req, res) => {
    console.log("Attempt to check if user is logged...");

    if (req.session.user) {
        console.log("User is logged!");
        res.status(200).send(true);
    } else {
        console.error("User is not logged!");
        res.status(200).send(false);
    }
});

/*
Delete, the cookie that identifies his browser and finally remove the banner. We lacked the time to set the destruction of
it's cards/decks.
*/

app.post("/delete-user", async (req, res) => {
    console.log("Intentando borrar usuario...");

    if (req.session.user) {

        const user = await USER.findOne({ _id: req.session.user.userId, password: req.body.password });

        if (user) {
            const deletedUser = await USER.findByIdAndDelete(req.session.user.userId);
            const deletedBanner = await BANNER.findOneAndDelete({ userId: req.session.user.userId });

            if (deletedUser && deletedBanner) {
                console.log("Usuario borrado!");

                req.session.destroy((err) => {
                    if (err) {
                        console.error("Error al cerrar la cuenta:", err);
                        res.status(500).send("Error on account delete");

                    } else {
                        console.log("Cuenta cerrada con éxito!");
                        res.status(200).send();
                    }
                });
            }

            else {
                console.log('No se ha encontrado el usuario a borrar!');
                res.status(404).send('User not found!');
            }

        } else {
            console.log('Contraseña incorrecta, no se borra el user.');
            res.status(401).send('Incorrect password!')
        }
    } else {
        console.log("Intento de borrar usuario sin iniciar sesión!");
        res.status(401).send();
    }
});

//Obtaining data about the banner.

app.post("/get-banner", async (req, res) => {
    if (req.session.user) {
        try {
            const userBanner = await BANNER.findOne({ userId: req.session.user.userId }).select('-_id -userId');;
            console.log("Devolviendo banner!");

            res.json(userBanner);

        } catch (e) {
            console.log("Error buscando banner");
            res.status(404).send('Banner not found');
        }
    }
});

/* 
We save the user banner. We first identify the user by it's current cookie and lately update the banner
document with the new or actual data.
*/

app.post("/save-banner", async (req, res) => {
    console.log("Intento de guardar banner recibido...");

    if (req.session.user) {
        try {
            const banner = await BANNER.findOne({ userId: req.session.user.userId }).select('_id');

            if (!req.body.nickname) {
                req.body.nickname = banner.nickname;
            }

            const updatedNickname = await USER.findByIdAndUpdate(req.session.user.userId, { nickname: req.body.nickname });

            delete req.body.nickname;

            const updatedBanner = await BANNER.findByIdAndUpdate(banner._id, req.body);

            if (updatedBanner && updatedNickname) {
                console.log("Banner actualizado correctamente!");
                res.status(200).send();
            } else {
                console.log("No se encontró el banner a guardar!");
                res.status(404).send("Banner not found");
            }

        } catch (error) {
            console.error("Error al guardar banner:", error);
            res.status(500).send("Error on saving banner");
        }
    }
    else {
        console.log("Intento de guardar banner sin iniciar sesión!");
        res.status(401).send("Trying to save banner whitout logging in!");
    }
});

/*
Get and return the current skills saved on the database. We also apply filters depending on the request data.
*/
app.post("/get-skills", async (req, res) => {
    console.log("Obteniendo habilidades...");

    let query = req.body;

    Object.keys(query).forEach(key => {
        const value = query[key];
        if (value === null) {
            delete query[key];
        }
    });

    query.name = { $regex: query.name, $options: 'i' };

    const requestedSkills = await SKILL.find(query);

    if (requestedSkills) {

        res.json(requestedSkills);
        console.log("Habilidades obtenidas");
    }

    else {
        console.log('No se han encontrado habilidades');
        res.status(404).send();
    }
});

/*
We save the card data as a new card. We do not have an endpoint to save/edit current existing cards yet.
*/
app.post("/save-card", async (req, res) => {
    console.log("Intento de guardar carta recibido...");

    if (req.session.user) {

        try {
            req.body.userId = req.session.user.userId;

            const newCard = new CARD(req.body);

            await newCard.save();

            console.log("Carta guardada correctamente!");
        } catch (e) {
            console.error("Error al guardar la carta: ", e);
        }

        res.status(200).send();
    } else {
        console.log("No hay cookie para guardar la carta, abriendo login!");
        res.status(401).send();
    }
});

/*
We get and return all the user cards data but it can be filtered by the request data if needed.
*/

app.post("/get-cards", async (req, res) => {
    if (req.session.user) {
        try {

            let query = req.body;

            Object.keys(query).forEach(key => {
                const value = query[key];
                if (value === null) {
                    delete query[key];
                }
            });

            if (query.name) {
                query.name = { $regex: query.name, $options: 'i' };
            }

            const cards = await CARD.find(query);

            console.log("Devolviendo cartas!");
            res.json(cards);
        } catch (e) {
            console.log("Error buscando usuarios");
            res.status(404).send('Renders not found')
        }
    } else {
        console.log("Intento de devolver cartas sin iniciar sesión!");
        res.status(401).send();
    }
});

/*
We get and return the user data by getting it from the collection where it is stored. For security and privacy,
it does not return the _id of the document or the password.
*/

app.post("/get-userdata", async (req, res) => {
    if (req.session.user) {
        try {
            const userData = await USER.findOne({ _id: req.session.user.userId }).select('-password -_id');
            console.log("Devolviendo informacion de usuario!");

            res.json(userData);
        } catch (e) {
            console.log("Error buscando usuarios");
            res.status(401).send();
        }
    } else {
        console.log("Atención! Alguien ha entrado sin loguearse en colecciones.html!");
        res.status(401).send();
    }
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});

//Opening and configuring the path of the index.html file to serve it as the homepage.
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});
