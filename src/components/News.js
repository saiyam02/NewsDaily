import React, {useEffect, useState} from 'react'
import NewsItem from './NewsItem'
import PropTypes from 'prop-types'
import Spinner from './Spinner';
import defaultNewsImg from './defaultNewsImg.jpg'

const capitalizeFirst = str => {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function News (props){

    const [articles, setArticles]=useState([])
    const [loading, setLoading]=useState(true)

    const updateNews = async()=>
    {
        props.setProgress(10);
        setLoading(true);
        console.log(props.query);
        let url = `https://gnews.io/api/v4/top-headlines?&topic=${props.category}&token=87264d8721f8011ee4e6ad0e19e12556&lang=en&country=${props.country}&q=${props.query}`;
        let data = await fetch(url);
        props.setProgress(40);
        let parsedData= await data.json();
        props.setProgress(80);
        setArticles(parsedData.articles);
        setLoading(false);
        props.setProgress(100);
    }
   useEffect (()=>{
        updateNews();
        // eslint-disable-next-line
   }, [])
    return (
        <>
        <div className="container my-3" >
        {(articles.length!==0 || loading) ?<h1>NewsDaily-Top {!(capitalizeFirst(props.category)==='Top-headlines')?capitalizeFirst(props.category):""} Headlines</h1>
        :<h1>No News Found for that keyword </h1>   
        }
            {loading?<Spinner/>:<></>}
            <div className="row">
                {articles.map((element)=>{
                    return <div className="col-md-4" key={element.url}>
                                <NewsItem source={element.source.name} title={element.title} ImgUrl={!element.image?defaultNewsImg:element.image} description={element.description?element.description.substring(0,element.description.length-100):" "} descriptionBlur={element.description?element.description.substring(element.description.length-100,element.description.length):" "} NewsUrl={element.url} time={element.publishedAt} />
                            </div>   
                })} 
            </div>
        </div>
        <div className="container d-flex justify-content-evenly my-3">
          {(loading&&articles.length!==0)?<Spinner/>:<></>}
        </div>
        </>
    )
  
}

News.defaultProps ={
    country: "in",
    category: 'breaking-news',
    query: ''
}

News.propTypes = {
    country: PropTypes.string,
    category: PropTypes.string,
    query: PropTypes.string
}