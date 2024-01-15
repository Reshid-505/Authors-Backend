let express = require("express")
let bodyParser = require("body-parser") 
let cors = require("cors") 
require("dotenv").config() 
let app = express()
const mongoose = require('mongoose');
const multer  = require('multer')
const storage = multer.diskStorage({
    destination:function(req,file,cb){
        return cb(null,"./images/")
    },
    filename:function(req,file,cb){
        const date = new Date()
        return cb(null,`author_image_${date.getTime()}_${file.originalname}`)
    }
})
const upload = multer({storage})
// const multer  = require('multer')
// const upload = multer({ dest: './images/' })

app.use(bodyParser.json())
app.use(cors())
let PORT = process.env.PORT || 3001


//Collection & Scheams
const AuthorsSchema= new mongoose.Schema({
    "name":String,
    "genre":String,
    "birthYear":Number,
    "bio":String,
    "image":String,
    "isDead":Boolean,
    "gender":Boolean
  },{versionKey: false})
const Authors = mongoose.model("Authors",AuthorsSchema) 

const BooksSchema= new mongoose.Schema({
    "authorId":String,
    "name":String,
    "genre":String,
    "year":Number,
    "coverImg":String,
    "description":String,
    "bookFile":String,
  },{versionKey: false})
  const Books = mongoose.model("Books",BooksSchema) 



// users CRUD
app.get("/api/authors",async (req,res)=>{
    const authors = await Authors.find()
    if(authors.length==0){
        res.status(204).send("empty data")
    }else{
        res.status(200).send(authors)
    }
})
app.get("/api/authors/:id",async (req,res)=>{
    let {id} = req.params
    const findedAuthor = await Authors.findById(id)
    if(findedAuthor){
        res.status(200).send(findedAuthor)
    }else{
        res.status(204).send("empty data")
    }
})
app.delete("/api/authors/:id",async (req,res)=>{
    let {id} = req.params
    const deletedAuthor = await Authors.findByIdAndDelete(id)
    await Books.deleteMany({authorId:String(id)})
    if(deletedAuthor){
        res.status(200).send(deletedAuthor)
    }else{
        res.status(201).send("empty data")
    }
})
app.post("/api/authors",upload.single("file"),async (req,res)=>{
    let  {name,genre,birthYear,bio,image,isDead,gender} = req.body
    let newData ={}
    if(name){
        newData.name=name
    }
    if(genre){
        newData.genre=genre
    }
    if(birthYear){
        newData.birthYear=birthYear
    }
    if(bio){
        newData.bio=bio
    }
    if(image){
        newData.image=image
    }
    if(isDead){
        newData.isDead=isDead
    }else{
        newData.isDead=false
    }
    if(gender){
        newData.gender=gender
    }else{
        newData.gender=false
    }
    const newAuthor = new Authors(newData)
    // if(name && genre && birthYear && bio && image){
        await newAuthor.save()
        res.status(201).send(newData)
    // }
})
app.put("/api/authors/:id",async (req,res)=>{
    let {id} = req.params
    let  {name,genre,birthYear,bio,image,isDead,gender} = req.body
    let newData ={
    }
    if(name){
        newData.name=name
    }
    if(genre){
        newData.genre=genre
    }
    if(birthYear){
        newData.birthYear=birthYear
    }
    if(bio){
        newData.bio=bio
    }
    if(image){
        newData.image=image
    }
    if(isDead){
        newData.isDead=isDead
    }
    if(gender){
        newData.gender=gender
    }
    let editedAuthor = await Authors.findOneAndReplace({_id:id},newData)
    res.status(201).send(editedAuthor)
})
app.patch("/api/authors/:id",upload.single("file"),async (req,res)=>{
    let {id} = req.params
    let  {name,genre,birthYear,bio,image,isDead,gender} = req.body

    let findedAuthor = {}
    if(name){
        findedAuthor.name=name
    }
    if(genre){
        findedAuthor.genre=genre
    }
    if(birthYear){
        findedAuthor.birthYear=birthYear
    }
    if(bio){
        findedAuthor.bio=bio
    }
    if(image){
        findedAuthor.image=image
    }
    if(isDead){
        findedAuthor.isDead=isDead
    }
    if(gender){
        findedAuthor.gender=gender
    }
    const editedAuthor = await Authors.findByIdAndUpdate(id,findedAuthor)
    res.status(201).send(editedAuthor)
})

// books CRUD

app.get("/api/books",async (req,res)=>{
    const books = await Books.find()
    if(books.length==0){
        res.status(204).send("empty data")
    }else{
        res.status(200).send(books)
    }
})
app.get("/api/books/:id",async (req,res)=>{
    let {id} = req.params
    const findedBook = await Books.findById(id)
    if(findedBook){
        res.status(200).send(findedBook)
    }else{
        res.status(204).send("empty data")
    }
})
app.delete("/api/books/:id",async (req,res)=>{
    let {id} = req.params
    const deletedBook = await Books.findByIdAndDelete(id)
    if(deletedBook){
        res.status(200).send(deletedBook)
    }else{
        res.status(201).send("empty data")
    }
})
app.post("/api/books",upload.single("file"),async (req,res)=>{
    let  {authorId,name,genre,year,description,coverImg,bookFile} = req.body
    let newData ={}
    if(authorId){
        newData.authorId=authorId
    }
    if(name){
        newData.name=name
    }
    if(genre){
        newData.genre=genre
    }
    if(year){
        newData.year=year
    }
    if(description){
        newData.description=description
    }
    if(coverImg){
        newData.coverImg=coverImg
    }
    if(bookFile){
        newData.bookFile=bookFile
    }
    const newBook = new Books(newData)
    // if(name && genre && birthYear && bio && image){
        await newBook.save()
        res.status(201).send(newData)
    // }
})
app.put("/api/books/:id",async (req,res)=>{
    let {id} = req.params
    let  {authorId,name,genre,year,description,coverImg,bookFile} = req.body
    let newData ={
    }
    if(authorId){
        newData.authorId=authorId
    }
    if(name){
        newData.name=name
    }
    if(genre){
        newData.genre=genre
    }
    if(year){
        newData.year=year
    }
    if(description){
        newData.description=description
    }
    if(coverImg){
        newData.coverImg=coverImg
    }
    if(bookFile){
        newData.bookFile=bookFile
    }
    let editedBook = await Books.findOneAndReplace({_id:id},newData)
    res.status(201).send(editedBook)
})
app.patch("/api/books/:id",upload.single("file"),async (req,res)=>{
    let {id} = req.params
    let  {authorId,name,genre,year,description,coverImg,bookFile} = req.body
    let findedBook = {}
    if(authorId){
        findedBook.authorId=authorId
    }
    if(name){
        findedBook.name=name
    }
    if(genre){
        findedBook.genre=genre
    }
    if(year){
        findedBook.year=year
    }
    if(description){
        findedBook.description=description
    }
    if(coverImg){
        findedBook.coverImg=coverImg
    }
    if(bookFile){
        findedBook.bookFile=bookFile
    }
    const editedBook = await Books.findByIdAndUpdate(id,findedBook)
    res.status(201).send(editedBook)
})





app.listen(PORT,()=>{
    console.log("App listening on port: " + PORT);
})
mongoose.connect(process.env.DB_CONNETCTION_KEY.replace("<password>",process.env.DB_PASSWORD))
.then(() => console.log('Connected!'));