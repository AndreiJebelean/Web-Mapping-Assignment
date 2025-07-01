Code Explaining: 

    Part 1: Create the Map and Add Base Map
Variables:
-centerLat & centerLng to define the start of the so called "tour"
-offsetLat centeres the map on the screen for better visual effect

Create map object:
-L.map('map', { center: [offsetLat, centerLng], zoom: 15 }) initializes Leaflet map in HTML with a zoom in so that only the needed area is on the screen. 

Add base tiles:
-Using L.tileLayer with a URL template from Stadia Maps, for the map design


Add base map:
-osmap.addTo(map) adds base layer to the map

Base maps object:
-Stores base layers to use with layer control.



    Part 2: Add Scale Bar
-scale control in the bottom right corner 



    Part 3: Double Click Alert
Listens for double-click events anywhere on the map. Double click shows a popup with the exact coordinates on the map, while also zooming in. 




    Part 4: Define Custom Icons
-three custom marker icons:

-Building icon (iconBuilding): For residences

-Statue icon (iconStatue): For statues

-Info icon (iconInfo): For tourist information points

-The size of the icons has been set in such a way taht it looks great on the map. 

-iconAnchor sets the exact pixel point that corresponds to the marker’s geographic location (bottom center).

-popupAnchor shifts the popup so it appears nicely above the icon.



    Part 5: Prepare Layers Containers
Creates three empty L.layerGroup() containers for different marker categories:

-artLayer for artworks

-residenceLayer for residences

-touristInfoLayer for info point





    Part 6: Marker Creation with Hover Effect
-Function createMarker(feature, icon) takes a GeoJSON feature and an icon, then creates a Leaflet marker

-Reads properties (name, description, website, image) to create a popup

Effects on marker click: 

-The map "flies" to the marker 

-After "flying" animation, the popup opens 

Hover effects:

-icon size gets bigger, making the marker stand out.



    Part 7: Load GeoJSON and Distribute Features
-Fetches data from local 'data/mozart.geojson'.

For each feature:

Reads tourism property and lowercases the name for logic.

Chooses icon based on:

-information → info icon,

-museum with names containing "residence" or "birthplace" → building icon,

-otherwise → statue icon.

Creates marker with createMarker.

Adds marker to appropriate layer group:

-artLayer for artworks,

-residenceLayer for museums,

-touristInfoLayer for info points.

Adds all three layers to the map, that can be selected from the layer control icon




    Part 8: Layer Control
Creates a Leaflet layer control on the left top corner

Allows toggling base map and/or overlays (art, residences, tourist info).




    Part 9: Central Marker
-Adds a fixed marker at the original center for better orientation: "Mozart Tour Starts Here!"

-It opens by default on load to guide users to the start point.



    Part 10: Custom Legend 
-Creates a legend control positioned bottom-left.

-Creates a HTML div with a heading and three rows, each containing aan icon image and coresponding label



    Part 11: Tour route with numbered markers
-Filters GeoJSON features to only keep those with valid Point geometries.

-Sorts the point features by their distance to the starting point named "Mozart Tour starts here"

-Extracts the coordinates of the points to create a list representing the tour route. Order defined my distance to strating point

-Draws an orange line connecting all the coordinates to visualize the tour route.

-Adds numbers to each of the points, showing an intuitive order in which a tourist can visit the sightings.










Report: Mozart’s Salzburg Attraction Points


1. Target User

The project "Mozart's Salzburg Attraction Points" has been realised for different purposes and for different audiences. On one side of the audience, there are the tourists visiting Salzburg. More specifically, fans of Mozart that want a small guide, on what they ca visit at their own pace and will or they could follow the order of the markers on each icon. Moreover, the map is also designed for cultural enthusiasts and  students intereseted in Mozart's life and the historical landmarks. The project was also designed for local tour guides and information centers who could use the help of an accessible, easy to understand and use visual tool to suplement their tours. 
The aim of the map is to provide an easy to navigate educational geographic visualisation of Mozart-related places in Salzburg, as well as creating a clear categorization of sites with rich contextual information. 


2. Data Sources

The data has been aquired online, with the help of some tools presented to us in class by our professor. The GeoJson file that contains the geographic coordinates and metadata for locations associated with Mozart, such as residences and statues, has been downloaded after a specific wizard query search in overpass turbo. 
The base map used is a Stadi Maps' Alidade Smooth Dark style map powered by OpenSteetMap data.
The base iamges used for the icons are icons found on Wiki Commons, a website with lots of free to use and download images. The icons have been chsosen in such a way that the user recognizes immediately their purpose. The house icon represents residences, the searhc icon represents the info point in Salzburg where you can look for information and the flag means "landmark", a point to visit, which represent statues and ark related to Mozart. Moreover, pictures of all the locations have been used. All pictures are from Wiki Commons.


3. Methodology

The mapping framework chosen for this project is Leaflet.js, selected for its easy to use nature, extensive customization options, and open-source flexibility, as well as being the software presented to us in class. 
The map utilizes a layered structure, organizing data points by tourism types such as art, residences, and tourist information which allows users to toggle and filter
these categories via layer controls on the top right corner. A range of interactive features enhances the user experience: popups on markers provide detailed information with images and external links for more information. Hover effects enlarge icons for better visibility; and a smooth "flying" zoom animation ensures intuitive navigation. Additionally, a double-click event captures coordinates for exact location of every point on the map. To improve usability, a custom legend in the bottom right corner clarifies the meaning of each different icon, aiding quick interpretation for the better understanding of the user. Finally, a route has been drawn on the map to achieve the tour feeling, also numerotatiing each 
attrative point based on how far away the user is from the starting point. 


4. Design Choices

Design plays a big role in web-mapping. Having a great and interactive design is key to have the users enjoy and use the map.
The dark-themed base map has been chosen for it's aesthetic appeal and to make colorfull icons and popups stand out from the rest. The design of the differnt icons improve recognition of site types at a glance, making it easy to find a specific type of attration point. The differnt layers allow the user to selctively explore different cathegories such as residences and art, preventing clutter. 
The popups are meant to be simple, but mformative, combining a short description of each landmark via text, hyperlinks to webnsites where user can read more about the subject and images, in order to have an idea of what the attration point looks like. 
The default zoom of 15 shows sufficient city detail without overwheling the users. It help to concentrate on the main are of city without having to zoom in numerous times. The user has everything in sight form the start.
Lastly, a few quality features have been added to the map. The first one being the legend on the bottom left corner. It helps in better understanding the visuals of the map and guides you through the meaning of the map. The smooth marker enlargement on hoover is supposed to  improve interactivity and accessibility.


5. Analysis of Implementation

The programming part of the project proved to be a challenging but entertaining part of the project. Learning to work with a new framework in a completely new environment (web-mapping) allowed for a good learning experience. It was clear from the start, that a good user experience means clear goals and standards for the web-page. In order to achieve those, a clean and well structured implementation was needed. 
The map offers solid functionality, with decently fast load times, clear layer rendering, and responsive interaction to user inputs. The user experience is further enhanced by smooth zooming and fly animations, allowing for intuitive and fluid navigation across the map. In terms of data visualization, the use of icons and informative popups delivers rich content while maintaining a clean and uncluttered design. Features like layer controls and a custom legend allow users to select the map to their interests, increasing engagement and usability. Moreover, the implementation of the route, gives the user a clear orientation of the order in which the sightings sould be visited. While error handling is present through basic logging of failed GeoJSON fetch attempts, it currently lacks direct user-facing notifications, leaving room for improvement in transparency during data load issues.

6. Potential Improvements

The potential improvements are required in order to achieve a well designed and usable by all (barriere freiheit) users map. 
To further enhance accessibility and usability, the map should also support keyboard navigation and offer improved popup readability through better contrast and scalable font sizes. Incorporating screen-reader friendly descriptions will make the map more inclusive for visually challenged users. Mobile optimization is also key, including adapting hover effects for touch interactions—such as tap events—and resizing controls for smaller screens, as well as having a well designed responsive design. Additional layers, such as public transport routes, walking paths would drasticaly improve the content. Moreover, more filtering controls could allow users to display only specific types of data, such as artworks from a particular era. To maintain performance with larger datasets, marker clustering should be implemented to minimize visual clutter. Expanding multi-language support for both UI and popup content would make the map more accessible to international users. Enabling user annotations or comments could improve interaction by allowing users to create personal notes or add photos directly on the map. 
In terms of error feedback, user-friendly notifications should be added to inform users when data fails to load.
A more detailed route from point to point could prove helpfull, as the route could show the exact streets you have to follow, however this would mean following a strict plan, in which a user could miss the feeling of freedom and feel as if his/her self exploring experience is limited. 

7. Critical Reflection

Even though the project suits it's purpose and fulfills all required parts, there is still room for improvement. 
The strenght of the web-map is it's easy to read and user friendly design. However, a more detailed and not so minimalistic style, as well as better images would definetely enhance the user experience even more. The choice of colurs and text-style coould also be improved by a professional designer. 
The small amount of data found aklso proved to be a challenge, as the addition of data or missing parts of the data was required. A more complete and well defined data file could have improved the UX and general feeling of the map. Right now, the ,map seems very simple and modest.

8. Key Takeaways

At the end of the project, a few factors became clear. Having the correct and complete data is key in designing a great web-map. On the positive part, interactive maps for cultural tourism offer rich user experiences by combining spatial data with multimedia-enhanced popups, delivering both context and engagement. The use of thoughtful iconography and intuitive layer controls encourages users to customize their view based on personal interests, whether they are exploring art, historical sites, or tourist information. Even small UX enhancements, such as icon enlargements on hover and smooth zoom transitions, significantly elevate the level of interaction and engagement. Lastly, an effective user friendly map depends on a careful balance between visual design and technical performance, ensuring that usability, accesability and functionality go hand in hand.