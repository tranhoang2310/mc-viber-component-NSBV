const express = require('express');
const app = express();
const path = require('path');
const webhook = require('./modules/webhook');

const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.PORT || 3000;

const customContentBlockRouter = require('./custom-content-block/custom_content_block_routes');
const customActivityRouter = require('./custom-activity/custom_activity_routes');

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/custom-content-block', customContentBlockRouter);
app.use('/custom-activity', customActivityRouter);


app.get('/icon.png', (req, res) => {
    res.writeHead(301, {
      Location: req.url.replace('/icon.png', '/assets/icons/viber_icon_80.png')
  }).end();
})

app.post(/^\/webhook\/(.*)/, (req, res) => {
  webhook.process(req, res);
})

app.get(/^\/webhook\/(.*)/, (req, res) => {
  webhook.process(req, res);
})

app.listen(PORT, () => {
    console.log('Server is listening on port ', PORT);
});

