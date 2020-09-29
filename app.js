const bodyParser = require("body-parser"),
methodOverride   = require("method-override"),
mongoose 		 = require("mongoose"),
express 		 = require("express"),
app 			 = express();

mongoose.connect("mongodb://localhost/blog_app", {
	useNewUrlParser: true,
	useUnifiedTopology: true
});
mongoose.set("useFindAndModify", false);

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));

const blogSchema = new mongoose.Schema({
	title: String, 
	image: String, 
	body: String, 
	created: {type: Date, default: Date.now}
})

var Blog = mongoose.model("Blog", blogSchema);

app.get("/", function(req, res){
	res.redirect("/blogs");
});

// INDEX
app.get("/blogs", function(req, res){
	Blog.find({}, function(err, blogs){
		if(err){
			console.log(err);
		} else {
			res.render("index", {blogs: blogs});
		}
	})
});

// NEW
app.get("/blogs/new", function(req, res){
	res.render("new");
});

// CREATE
app.post("/blogs", function(req, res){
	Blog.create(req.body.blog, function(err, newBlog){
		if(err){
			res.render("new");
		} else {
			res.redirect("/blogs");
		}
	})
})

// SHOW
app.get("/blogs/:id", function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blogs");
		} else {
			res.render("show", {blog: foundBlog});
		}
	});
})

// EDIT
app.get("/blogs/:id/edit", function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blogs");
		} else {
				res.render("edit", {blog: foundBlog});
		}
	});
})

// UPDATE
app.put("/blogs/:id", function(req,res){
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
		if(err){
			res.redirect("/blogs");
		} else {
			res.redirect("/blogs/" + req.params.id);
		}
	})
})

app.listen(3000, function(){
	console.log("Server is running!");
})