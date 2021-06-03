let express = require("express");
var bodyParser = require("body-parser");
let app = express();
let http = require("http").Server(app);
let io = require("socket.io")(http);
let mongoose = require("mongoose");
const { stringify } = require("querystring");

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

let dbUrl =
  "mongodb+srv://admin:admin@mango-nodedb.mqfjs.mongodb.net/bls?retryWrites=true&w=majority";

let Message = mongoose.model("Message", {
  name: String,
  message: String,
});

app.get("/messages", (req, res) => {
  Message.find({}, (err, messages) => {
    res.send(messages);
  });
});

app.post("/messages", (req, res) => {
  let message = new Message(req.body);
  message.save((err) => {
    if (err) sendStatus(500);
    io.emit("message", req.body);
    res.sendStatus(200);
  });
});

io.on("connection", (socket) => {
  console.log("user connected");
});

mongoose.connect(dbUrl, (err) => {
  console.log("mongodb connention successful");
});

let server = http.listen(3020, () => {
  console.log(`Server is listening on port`, server.address().port);
});
