# About SimPL
<img src="http://simpl.vfab.org/repo/cms.png">

## 'Sim'ulaton 'PL'atform Creator
'SimPL' is a Content Management System for Simulation Platforms.

## The objectives of SimPL are :
- To provide researcher-friendly(not developer-friendly) development environments
- To spread researcher's precious knowledge(include code, know-how and pre/post processing skills
- To generate research bigdata for diverse field of research

## In SimPL,
- You can create your own simulation platform customized for you with functions what you want .
- You can do modeling, calculation, and analysis in one platform.
- Your platform development process will be very simple.
- You can easily import platforms shared by others and create new platforms or add functions to your platform.

## There are 2 key components of SimPL
1) Pages
"Page" is a web page which consists of standard web elements(images, texts, links, input form...) and SimPL web components.
2) Plugins
"Plugin" is a small program which connects back-end elements(such as solver, linux server,...) to Pages.
Currently, Plugins are written in Python(2.7.3) and we're planing to give more options to SimPL Creators.

# Install SimPL

## Environment

### Development Framework
Laravel 5.5, Bootstrap 3.3.7

### Operating Environment
Apache, PHP( > 7.0), MySQL( > 5.7) or MariaDB ( > 10.2)

### Required System
Python 2.7, Torque PBS Scheduler

## Procedure

### 1. Download SimPL
https://github.com/simpl-kist/SimPL_public.git

### 2. Set Laravel Environment
Open ".env" in SimPL Repository folder and set laravel environment.

### 3. Login to your SimPL
Go to "http(s)://your-url/admin" to sign in and log in.
The first regeisterer will become an admin.

### 4. Set SimPL Environment
Go to "General" and set SimPL environment.

### 5. Run simpl_init.sh
simpl_init.sh will automatically create the initial structure of the DB.

# Component

## Page
As described in the introduction section, "Page" is a specialized html page for simulation platform. You can use typical html tags such as table, div, font,.. and SimPL Web Components to make your "Page". "Page" usually consist of CSS(Design), HTML(Body), Javascript(Funtions).

### Make Page
There are two ways to create a page.
The first is "Script". You can write CSS, HTML and Javascript here.
Next is WYSIWYG Editor. You can easily edit HTML to create layouts.

### VLatoms
VLAtoms is web based atomic visualizer. VLAtoms is written by Javascipt and using web-standard components such as Canvas, WebGL and Javascript.
Thus, Most of modern web brower supports VLAtoms without any plugins.
You can include VLAtoms into your page with a tag below.
{ { kCMS|VLATOMS|vla|width:500,height:500} } (remove space between { and { )

### Include
You can make a page by combination of other pages by code below:
{ { kCMS|PAGE|alias } }
"alias" is an alias of other page defined in the page editor

### Call a plugin using Javascript
You can connect your page with "Plugin" by SimPL JS API. Basically, SimPL JS API is a wrapper of $.ajax function of jQuery.
Javascript Function
kCMS.callPlugin( [plugin alias], data, [callback function]); will call a plugin by alias with given data, and callback function will be launched when plugin execution is done.

### Get from simpl.vfab.org
You can import the necessary page from the SimPL main repository.
You can add that page to your SimPL in a simple way by clicking on the Get SimPL button on the "Page" edit page and then entering the repository ID for that Page.

## Plugin
As described in the introduction section, Plugin is a simple program. Expeced role of plugins are :
- To prepare input scripts for solver
- To submit job to solver
- To handle atomic structure with complicated modifications
- To parse output files of user's job
Because the plugin is a python script and there's no limitation to access server, You must carefully make your plugin if your plugin writes or deletes some files in the server

### Plugin Workflow
When plugin is execued, SimPL automatically generate job directory and python script files.
- +20171211162048_42f21bd7c6afd551972446d7bbf32909
- |-kCmsHeader_global.py
- |-kCmsHeader_global.pyc
- |-kCmsScript__hellosimpl

Here, kCmsHeader_global* script consists of several kCMS functions and user's input as a global variable.

### Plugin Input/Output
User's input variables are stored in the global variable kCms['input'] so that your plugin can easilly use the user's input
In example, your Page passes "name":"Minho Lee" as a data for your plugin, kCms['input'] should be
kCms['input'] = {'name':'Minho Lee'} .
You can check example case used at "Call a plugin using Javascript" section in the Plugin edit menu in admin page.
Also, you can export your plugin's output via json.dumps function in your plugin.
In example,
print json.dumps("Hello"+kCms['input']['name'])
gives return value of your plugin

### Call Plugin from another plugin
Plugin can be called from another plugin.
As similar to the "Call a plugin using Javascript", You can call other plugin from your plugin by function
callPlugin('[plugin Alias]',[Input args])
"callPlugin" function will return output and error of called plugin as JSON format
so it is necessary to parse JSON data to Python dictionary like
output = json.loads( callPlugin(...) )

### Solver
Solver is the page where you register your calculation methodology.
When you register a solver, you can fill in 5 inputs.

*"Name" is the solver's name.(Names can not be duplicated.)
*"Path" is the path where the solver is installed.
"Exec Command" is the command when using the solver.
"Version" is the solver's version.
"Author" is the person who develped the solver.
*is required.

### Built-in Functions
<table>
  <thead>
    <tr>
      <th>Function</th>
      <th>Input</th>
      <th>Output</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>file_get_contents</td>
      <td>(filename, use_include_path = 0, context = None, offset = -1, maxlen = -1)</td>
      <td>File Context</td>
      <td>Read File data</td>
    </tr>
    <tr>
      <td>getSolver</td>
      <td>(solvername)</td>
      <td>Sover Info</td>
      <td>Import registered Solver information for using.</td>
    </tr>
    <tr>
      <td>qsub</td>
      <td>(params={ mpi : True|False, # solverExec : [execution command for solver], # ppn : processors per node, nnodes : number of nodes })</td>
      <td>Queue ID</td>
      <td>Submit the job to the scheduler.</td>
    </tr>
    <tr>
      <td>qstat</td>
      <td>(id=-1)</td>
      <td>Status of the job in Scheduler.</td>
      <td>Check the status of jobs in the scheduler.</td>
    </tr>
    <tr>
      <td>callPlugin</td>
      <td>(Plugin Alias, Input Data)</td>
      <td>Output of the called Plugin</td>
      <td>Call another plugin.</td>
    </tr>
    <tr>
      <td>getMyInfo</td>
      <td>()</td>
      <td>The information of the user</td>
      <td>>Load the information of the user who called the plugin </td>
    </tr>
    <tr>
      <td>getRepo</td>
      <td>(Alias of file in Repository for server)</td>
      <td>File Contents</td>
      <td>Read the file in the Repository for Server.</td>
    </tr>
    <tr>
      <td>saveJob</td>
      <td>(args={qinfo, status, pluginId, jobBefore, jobNext, input, output, name, jobdir})</td>
      <td>DB id of Job</td>
      <td>Save Something to DB.</td>
    </tr>
    <tr>
      <td>getJobs</td>
      <td>(args={"cols":[column list you want to get],
        "order":[key,("asc" or "desc"),
        "limit":["offset","limit"],
        "criteria":["array of criteria(Raw Where Query)"],
        [columns]:[value]
        })</td>
      <td>Jobs that meet the conditions.</td>
      <td>Load Saved Job Data from DB.</td>
    </tr>
  </tbody>
</table>

### Get from simpl.vfab.org

You can import the necessary plugin from the SimPL main repository.
You can add that page to your SimPL in a simple way by clicking on the Get SimPL button on the "Plugin" edit page and then entering the repository ID for that Plugin.

## Preset

### My Info

Your-url/preset/myInfo

### Javascript Functions

- kCms.callPlugin("pluginAlias",data={"input data"},callback=function(ret){..})
- kCms.uploadFile("repos_for"=("web, "server"),files,callback=function(ret){...})
- kCms.downloadFile("repos_for"=("web, "server"),["list of file alias"])

## Jobs
Job is the place to store something in SimPL. It is structured to store any data. You can store and load data by the plugin built-in functions saveJobs and getJobs.

### Job table structure

<table>
  <thead>
    <tr>
      <th>Column</th>
      <th>Type</th>
      <th>Default</th>
      <th>Remarks</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>id</td>
      <td>unsigned int(10)</td>
      <td>not nullable(auto-increment)</td>
      <td></td>
    </tr>
    <tr>
      <td>parent</td>
      <td>int(11)</td>
      <td>nullable</td>
      <td></td>
    </tr>
    <tr>
      <td>project</td>
      <td>int(11)</td>
      <td>nullable</td>
      <td></td>
    </tr>
    <tr>
      <td>owner</td>
      <td>int(11)</td>
      <td>nullable</td>
      <td></td>
    </tr>
    <tr>
      <td>type</td>
      <td>varchar(255)</td>
      <td>nullable</td>
      <td></td>
    </tr>
    <tr>
      <td>qinfo</td>
      <td>longtext</td>
      <td>nullable</td>
      <td></td>
    </tr>
    <tr>
      <td>jobdir</td>
      <td>varchar(255)</td>
      <td>nullable</td>
      <td></td>
    </tr>
    <tr>
      <td>status</td>
      <td>varchar(32)</td>
      <td>nullable</td>
      <td></td>
    </tr>
    <tr>
      <td>pluginId</td>
      <td>int(11)</td>
      <td>nullable</td>
      <td></td>
    </tr>
    <tr>
      <td>jobBefore</td>
      <td>longtext</td>
      <td>nullable</td>
      <td></td>
    </tr>
    <tr>
      <td>jobNext</td>
      <td>longtext</td>
      <td>nullable</td>
      <td></td>
    </tr>
    <tr>
      <td>input</td>
      <td>longtext</td>
      <td>nullable</td>
      <td></td>
    </tr>
    <tr>
      <td>output</td>
      <td>longtext</td>
      <td>nullable</td>
      <td></td>
    </tr>
    <tr>
      <td>name</td>
      <td>text</td>
      <td>nullable</td>
      <td></td>
    </tr>
    <tr>
      <td>created_at</td>
      <td>timestamp</td>
      <td>nullable</td>
      <td></td>
    </tr>
    <tr>
      <td>updated_at</td>
      <td>timestamp</td>
      <td>nullable</td>
      <td></td>
    </tr>
  </tbody>
</table>

## Repository
- You can upload files for "web" and "server". 
- In "Repository for Web", you can usually upload a picture files and include them your page like "< img src="repo/alias of file" >". 
- Files to be used by the plugin are uploaded to "Repository for Server". They can be read with the plugin built-in function getRepo.
