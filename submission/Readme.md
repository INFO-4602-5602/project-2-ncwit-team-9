<h1>Project 1: Visualizing NCWIT Data</h1>
<h2> Ashwin Sankaralingam, Gena Welk, Sreesha Nath, Supriya Naidu </h2>

As expected from real world data, we recieved a lot of data and not all of it was pretty. We decided to invest in cleaning the data and choosing the datapoints that we found to be coherent enough to answer our questions. This helped us create a story of our own. Please read ahead to know more about our visualizations and the efforts that went behind them.

<h3>The Dataset</h3>
The dataset was provided by NCWIT and consists of various demographic data about both potential and enrolled students, and even graduated students.  This data was detailed by institution and by major.

We filtered the data to emphasize our goals of our chosen storyline (outlined below).  This means that we looked for records of 14 institutions which had the highest quantity and consistency of data for freshman, sophomore, junior, and senior GPA’s as well high school GPA’s.  Each of these 14 institutions had a minimum of 10 records each which showed the desired information. (We did not include 5th Yr Senior data as there was not sufficient information by which to draw preliminary conclusions.)

<h3>Storyline</h3>
Based off of the data we could condense, we decided to start our story by showing the enrollments of students of each and both genders per year and the distibution across races. We then moved on to project the trajectory of students grades as they transition from high school to college and through the college years. Eventually we decided to potray the nature of student dropouts from different majors and across college years. Finally, for an overview of the Total Female students that are attending programs where they utilize NCWIT Extension Services (ES) vs. simply being NCWIT Academic Alliance (AA) members.

<h3>Prototype and Process</h3>
For data cleaning, we consolidated some of the majors that were duplicated, while keeping the intent of the original.  For example, we combined the following:<br/>
-----------------------------------------<br/>
Computer and Information Science<br/>
Computer and Information Sciences<br/>
-----------------------------------------<br/>
Computer Science<br/>
Computer Science (this one had a space at the end)<br/>
Computer Science &<br/>
Computer Science +<br/>
Computer Science + X<br/>
-----------------------------------------<br/>
Electrcal & Computer Engineering<br/>
Electrical & Computer Engineering<br/>
Electrical and Computer Engineering<br/>
-----------------------------------------<br/>
General Engineering<br/>
General Engineering (this one had a space at the end)<br/>
-----------------------------------------<br/>
Information Science<br/>
Information Science (this one had a space at the end)<br/>
Information Sciences<br/>
-----------------------------------------<br/>
Information Technology<br/>
Information Technology (this one had a space at the end)<br/>

Another cleaning item we did was alter the following descriptions for column “NCWIT Alliance” so that we ended up with only 2 options for this field (which left 4 records of 2,905 records as blank):<br/>
Academic Alliance ---->  Academic Alliance<br/>
Academic Alliance, Academic Alliance ---->  Academic Alliance<br/>
Extension Services, Academic Alliance ---->  Extension Services<br/>
 
For our prototyping process we experimented with the designs via sketching prior to implementation. You can find them here:
_Source:_ [viz1](project-2-ncwit-team-9/Prototyping/IMG_3811.jpg)
_Source:_ [viz1](project-2-ncwit-team-9/Prototyping/IMG_3812.jpg)

<h3></h3>


_Source:_  [inspiration](http://bl.ocks.org/enjalot/1429426)
