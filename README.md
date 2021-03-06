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
  location: "http://www.myblog.com",
  appRoot: __dirname
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
	* `category`: String category name (when using `/category` route)
  * `tags`: Array of tag strings (when using `/tags` route)
	* `articles`: Array of article objects
* 404
	* `url`: URL string that resulted in the 404
* 503
	* `error`: Error string

### CSS

You can organize your css at the path specified with `cssPath` however you see fit, wato requires no particular way of doing things.

### Run

Running wato requires setting some environment variables:

1. `export COOKIE_SECRET=<your secret>`
2. `export MONGO_URI=<mongo uri>`

Run the init file

1. `nodemon init.js -e js,jade,css`

**NOTE** In order to pick up changes made to templates and stylesheets, you must use nodemon and specify the file extensions to watch

## Using Wato

Navigate to `/login`, if this is the first time wato has been run, you will be prompted to create a root user with the highest level permissions. Once created, you will be redirected to the article editor page. Wato's editor tools include the following

* `/edit/article`: Edit the content/settings of an article
* `/edit/template`: Edit the contents of your templates
* `/edit/css`: Edit the contents of your css files
* `/edit/all`: Lists articles, drafts, and trashed articles
* `/edit/users`: Manage users

### Creating articles

Navigate to `/edit/article`. You will see a markdown editing space and a "show params" button. Clicking this button reveals a panel where basic meta-data pertaining to your article can be set. Markdown syntax is highlighted automatically in the editing space. Clicking "Preview" in the top right pops a new window with a preview of your article. Use the "Attach CSS" to attach specific CSS files to the article. Save with "Save".

### Managing Template/CSS

Navigate to `/edit/template` or `/edit/css`. Both pages have the same structure; and edit space for modifying the file, and in the params panel there are options for previewing your work before saving.

### Managing users

Navigate to `/edit/users`. The first table shows current users, the second is a form for creating new users. The only changes to be made are permissions and password (as well as removing the user).

The permissions levels are:

0. No Permissions: essentially removes the user with the option in the future to reinstate them
1. Read Access: User can use the editor tools but cannot save (essentially just for "demo" mode)
2. Read/Write Access: Normal permissions, edit articles, css, and templates
3. Read/Write & Manage Users: All level 2 permissions plus the ability to modify users

