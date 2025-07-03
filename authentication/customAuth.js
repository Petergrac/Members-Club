function isAuth(req,res,next){
    if(req.isAuthenticated()){
        next()
    }
    else{
        res.redirect('/login');
    }
}
function isAdmin(req,res,next){
    const userId = req.user.id;
}
module.exports = {
    isAuth,
}