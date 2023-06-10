const express = require('express');
const {Configuration, OpenAIApi} = require("openai");
const app = express();
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const {v4: uuidv4} = require('uuid');
const session = require("express-session");
const {dataSource} = require("./entity/dataSource");
require("dotenv").config();
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


dataSource
    .initialize()
    .then(function () {
        // var category1 = {
        //     name: "TypeScript",
        // }
        // var category2 = {
        //     name: "Programming",
        // }
        //
        // var post = {
        //     title: "Control flow based type analysis",
        //     text: "TypeScript 2.0 implements a control flow-based type analysis for local variables and parameters.",
        //     categories: [category1, category2],
        // }
        //
        // var postRepository = dataSource.getRepository("post")
        // postRepository
        //     .save(post)
        //     .then(function (savedPost) {
        //         console.log("Post has been saved: ", savedPost)
        //         console.log("Now lets load all posts: ")
        //
        //         return postRepository.find()
        //     })
        //     .then(function (allPosts) {
        //         console.log("All posts: ", allPosts)
        //     })
    })
    .catch(function (error) {
        console.log("Error: ", error)
    })


process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
app.use(session({
    secret: 'SECRET', // 암호화하는 데 쓰일 키
    resave: false, // 세션을 언제나 저장할지 설정함
    saveUninitialized: true, // 세션에 저장할 내역이 없더라도 처음부터 세션을 생성할지 설정
    cookie: {	// 세션 쿠키 설정 (세션 관리 시 클라이언트에 보내는 쿠키)
        httpOnly: false, // 자바스크립트를 통해 세션 쿠키를 사용할 수 없도록 함
    },
}));

app.use(cors());
app.use(express.json());
app.use(function (req, res, next) {
    const userId = req.session.userId;
    const url = req.url;
    if (url.includes('assets') || url.includes('login') || url.includes('sign-up')) {
        return next();
    }
    if (userId === undefined) {
        return res.redirect('/login.html');
    }
    return next();
});
app.use('/', express.static(__dirname + '/client')); // Serves resources from client folder

// Set up Multer to handle file uploads
const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads/')
        },
        filename: function (req, file, cb) {
            const extension = path.extname(file.originalname);
            const filename = uuidv4() + extension;
            cb(null, filename);
        }
    }),
    limits: {fileSize: 1024 * 1024 * 10}, // 10 MB
    fileFilter: function (req, file, cb) {
        const allowedExtensions = ['.mp3', '.mp4', '.mpeg', '.mpga', '.m4a', '.wav', '.webm'];
        const extension = path.extname(file.originalname);
        if (allowedExtensions.includes(extension)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type.'));
        }
    }
});

app.post('/transcribe', upload.single('audio'), async (req, res) => {
    try {
        const resp = await openai.createTranscription(
            fs.createReadStream(req.file.path),
            "whisper-1",
            'text'
        );
        return res.send(resp.data.text);
    } catch (error) {
        const errorMsg = error.response ? error.response.data.error : `${error}`;
        console.log(errorMsg)
        return res.status(500).send(errorMsg);
    } finally {
        fs.unlinkSync(req.file.path);
    }
});

app.post('/get-prompt-result', async (req, res) => {
    // Get the prompt from the request body
    const {prompt, model = 'gpt'} = req.body;

    // Check if prompt is present in the request
    if (!prompt) {
        // Send a 400 status code and a message indicating that the prompt is missing
        return res.status(400).send({error: 'Prompt is missing in the request'});
    }

    try {
        // Use the OpenAI SDK to create a completion
        // with the given prompt, model and maximum tokens
        if (model === 'image') {
            const result = await openai.createImage({
                prompt,
                response_format: 'url',
                size: '512x512'
            });
            return res.send(result.data.data[0].url);
        }
        if (model === 'chatgpt') {
            console.log(prompt)
            const result = await openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: [
                    {role: "user", content: prompt}
                ]
            })
            return res.send(result.data.choices[0]?.message?.content);
        }
        const completion = await openai.createCompletion({
            model: 'text-davinci-003', // model name
            prompt: `Please reply below question in markdown format.\n ${prompt}`, // input prompt
            max_tokens: 4000
        });
        // Send the generated text as the response
        return res.send(completion.data.choices[0].text);
    } catch (error) {
        const errorMsg = error.response ? error.response.data.error : `${error}`;
        console.error(errorMsg);
        // Send a 500 status code and the error message as the response
        return res.status(500).send(errorMsg);
    }
});

app.post('/login', async (req, res) => {
    console.log(req.session.userId);
    console.log(req.body.email);
    console.log(req.body.password);
    const userRepository = dataSource.getRepository("user")
    const user = await userRepository.findOne({
        where: {
            email: req.body.email,
            password: req.body.password,
        }
    });
    if (!user) {
        return res.json({
            success: false,
        });
    }
    req.session.userId = user.id;
    return res.json({
        success: true,
    });
})

app.post('/sign-up', async (req, res) => {
    const userRepository = dataSource.getRepository("user");
    const user = await userRepository.save({
        email: req.body.email,
        password: req.body.password,
    });
    req.session.userId = user.id;
    return res.json({
        success: true,
    });
})

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening on port ${port}`));
