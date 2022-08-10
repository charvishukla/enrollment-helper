=== README

== PART 1

A script to generate CURL requests and put the 
responses into the `CATALOG` dirctory. Each subdir
is a major, and each file within the major dir is 
a page. Each page holds multiple courses within the
major. 

- Get the first pages of all majors
- Compute total pages for each major
- Run a second pass of requests for extra pages

== Processing the Data

- Remove all unneeded HTML. 
- Compile pages into a single table in 1 HTML

Goal: 
- HTML pages with the file names corresponding to 
the major name. each page just has a single table
holding all info about that major. 

- TODO: 
  - DOM Manipulation. Removing, adding, modifying
    HTML elements, tags, etc. 



== PART 2

1. Converting all the HTMl pages (table) to a JSON object. 
2. Create a database entry for all these objects. 
3. Clean up data. 


== PART 3

Creating the frontend for your app which will use the database
to fetch + process data. 



