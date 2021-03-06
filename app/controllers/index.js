var Movie = require('../models/movie')
var Category = require('../models/category')
var Config=require('../../config');
    //index page
exports.index = function(req, res) {
    Category
        .find({})
        .populate({ //每个分类下取出5条 
            path: 'movies',
            options: {
                limit: 5
            }
        })
        .exec(function(err, categories) {
            if (err) {
                console.log(err);
            }
            res.render('index', {
                title: '首页',
                categories: categories
            })
        });
}
    //search page
exports.search = function(req, res) {
    var catId=req.query.cat;
    var q=req.query.q;
    var page=Number(req.query.p) || 0;
    var count=Config.pagecount || 2;
    var index=page * count;
    if(catId){//分类id查询
        Category
            .find({_id:catId})
            .populate({
                path: 'movies',
                select: 'title poster',
            })
            .exec(function(err, categories) {
                if (err) {
                    console.log(err);
                }
                var category=categories[0] || {};
                var movies=category.movies || [];
                var results=movies.slice(index, index+count);
                res.render('results', {
                    title: '结果列表页面',
                    keyword:category.name,
                    query:'cat='+catId,
                    currentPage:(page+1),
                    totalPage:Math.ceil(movies.length/count),
                    movies: results
                });
            });
    }else{//关键字模糊查询
        Movie.find({title:new RegExp(q+'.*','i')})
            .exec(function(err,movies){
                if(err) console.log(err);

                 var results=movies.slice(index, index+count);

                res.render('results', {
                    title: '结果列表页面',
                    keyword:q,
                    query:'q='+q,
                    currentPage:(page+1),
                    totalPage:Math.ceil(movies.length/count),
                    movies: results
                });
            })
    }
    
}