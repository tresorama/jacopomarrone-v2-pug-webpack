import Cursor from "./lib/Cursor";
import Icons from "./module/Icons";
import ShapeDividers from "./module/ShapeDividers";
import Works from "./module/Works";
import HomeGrid from "./module/HomeGrid";
import Contact from "./module/Contact";
import PrototypeView from "./module/OnlyWhenPrototype";
import '../scss/style.scss';

new Icons();
new ShapeDividers();
new Cursor({ delay: 120 });

new HomeGrid();
new Works();
new Contact();

new PrototypeView();