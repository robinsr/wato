WatoCMS
=======

Share your coding insights with the internets.

## Install

### Dependencies

1. [Node](https://nodejs.org/download/)
2. [MongoDB](http://docs.mongodb.org/manual/installation/) - You can install your own or use a service such as [MongoLab](https://mongolab.com/)

### Setup

1. `mkdir myBlog && cd myBlog`
2. `npm init` (follow instructions)
3. `npm install --save robinsr/wato` (Install directly from github)

### Config

1. `mkdir myBlog/resources`
2. `mkdir myBlog/resources/views`
3. `mkdir myBlog/resources/styles`
4. `touch myBlog/resources/views/index.jade`
5. `touch myBlog/resources/styles/style.css`
6. `touch myBlog/init.js`. Add the following:

```javascript
var wato = require('WatoCMS');

wato.init({
  title: "My Blog",
  location: "http://www.myblog.com"
}, {
  cssPath: 'resources/styles',
  viewsPath: 'resources/views'
})
.start();
```

### Views

Wato will look for the following views:

* index
* article
* allarticles
* category
* 404
* 503

You can organize your views however you like (such as using a `layout` file or an `includes/` directory with various partial views)

Every view has access to the properties you list in `init.js` (`title` and `location` in the example). Specific views also have the following variables:

* index
	* `articles`: array of article objects with the following properties:
        * `_id`: Unique ID
        * `tags`: Array of tags
        * `cssFiles`: Array of css files
        * `destination`: Enum ('articles', 'drafts', 'trash')
        * `previewText`: Sample of article content
        * `category`: Category name
        * `content`: Article content (string:html)
        * `url`: Article url
        * `title`: Article title
* article
	* A single article object (see above)
* allarticles
	* `articles`: Array of article objects
	* `count`: Number of articles 
	* `page`: Current page number
	* `pages`: Total number of pages
* category
	* `category`: String category name
	* `articles`: Array of article objects
* 404
	* `url`: URL string that resulted in the 404
* 503
	* `error`: Error string

### CSS

You can organize your css at the path specificed with `cssPath` however you see fit, wato requires no particular way of doing things.

### Run

Running wato requires setting some environment variables:

1. `export COOKIE_SECRET=<your secret>`
2. `export MONGO_URI=<mongo uri>`

Run the init file

1. `node init.js`

## Using Wato

Navigate to `/edit`, you will be redirected to the login page if you are not logged in. If this is the first time wato has been run, you will be prompted to create a root user with the highest level permissions. Once created, you will be redirected to the article editor page. Wato's editor tools include the following

* `/edit/article`: Edit the content/settings of an article
* `/edit/template`: Edit the contents of your templates
* `/edit/css`: Edit the contents of your css files
* `/edit/all`: Lists articles, drafts, and trashed articles
* `/edit/users`: Manage users

### Creating articles

Navigate to `/edit/article`. You will see 





