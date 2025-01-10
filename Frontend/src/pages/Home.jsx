// import './App.css'
import NavBar from '../NavBar.jsx'
import Home from '../HomePage/Home.jsx'
import LatestCars from '../HomePage/LatestCars.jsx'
import LatestBikes from '../HomePage/LatestBikes.jsx'
import Footer from '../HomePage/Footer.jsx'



function PageHome() {

  return (
      <>
        <NavBar />
        <Home />
     
        <LatestCars />
        <LatestBikes />
        <Footer/>
    </>
  )
}

export default PageHome;

