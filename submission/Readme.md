<h1>Project 1: Visualizing NCWIT Data</h1>
<h2> Ashwin Sankaralingam, Gena Welk, Sreesha Nath, Supriya Naidu </h2>

As expected from real world data, we recieved a lot of data and not all of it was pretty. We decided to invest in 
cleaning the data and choosing the datapoints that we found to be coherent enough to answer our questions. This helped us 
create a story of our own. Please read ahead to know more about our visualizations and the efforts that went behind them.

<h3>The Dataset</h3>
The dataset was provided by NCWIT and consists of various demographic data about both potential and enrolled students, 
and even graduated students.  This data was detailed by institution and by major.

We filtered the data to emphasize our goals of our chosen storyline (outlined below).  This means that we looked for 
records of 14 institutions which had the highest quantity and consistency of data for freshman, sophomore, junior, and 
senior GPA’s as well high school GPA’s.  Each of these 14 institutions had a minimum of 10 records each which showed the 
desired information. (We did not include 5th Yr Senior data as there was not sufficient information by which to draw 
preliminary conclusions.)

<h3>Storyline</h3>
Based off of the data we could condense, we decided to start our story by showing the enrollments of students of each 
and both genders per year and the distibution across races. We then moved on to project the trajectory of students grades 
as they transition from high school to college and through the college years. Eventually we decided to potray the nature 
of student dropouts from different majors and across college years. Finally, for an overview of the Total 
Female students that are attending programs where they utilize NCWIT Extension Services (ES) vs. simply being NCWIT 
Academic Alliance (AA) members.

<h3>Prototype and Process</h3>
For data cleaning, we consolidated some of the majors that were duplicated, while keeping the intent of the original.  For example, we combined the following:
-----------------------------------------
Computer and Information Science
Computer and Information Sciences
-----------------------------------------
Computer Science
Computer Science (this one had a space at the end)
Computer Science &
Computer Science +
Computer Science + X
-----------------------------------------
Electrcal & Computer Engineering
Electrical & Computer Engineering
Electrical and Computer Engineering
-----------------------------------------
General Engineering
General Engineering (this one had a space at the end)
-----------------------------------------
Information Science
Information Science (this one had a space at the end)
Information Sciences
-----------------------------------------
Information Technology
Information Technology (this one had a space at the end)

Another cleaning item we did was alter the following descriptions for column “NCWIT Alliance” so that we ended up with only 2 options for this field (which left 4 records of 2,905 records as blank):
Academic Alliance ---->  Academic Alliance
Academic Alliance, Academic Alliance ---->  Academic Alliance
Extension Services, Academic Alliance ---->  Extension Services
 

For our prototyping process we experimented with the designs via sketching prior to implementation. (images referred here)


_Source:_  [inspiration](http://bl.ocks.org/enjalot/1429426)
