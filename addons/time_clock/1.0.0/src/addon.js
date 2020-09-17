import Index from "./pages/index.vue";
import Settings from "./pages/settings.vue";
import Detail from "./pages/detail.vue";
import Search from "./pages/search.vue";
import SelectPicker from "./pages/select-picker.vue";
import MapPage from "./pages/map.vue";
import TakePhoto from './pages/take-photo';

console.log('TIME_CLOCK addon');

const routes = [
  {
    path: "/time-clock/",
    component: Index,
  },
  {
    path: "/time-clock/settings/",
    component: Settings,
  },
  {
    path: "/time-clock/detail/:id",
    component: Detail,
  },
  {
    path: "/time-clock/search/",
    component: Search,
  },
  {
    path: "/time-clock/select-picker/",
    component: SelectPicker,
  },
  {
    path: "/time-clock/map/",
    component: MapPage,
  },
  {
    path: "/time-clock/take-photo/",
    component: TakePhoto,
  },
];

export default routes;
