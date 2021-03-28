
export class MockVideoApi {
    getVideos(page, rowsPerPage){
       let videos = [];

       const startIndex = page*rowsPerPage;
       const date = new Date();
       for(let i = startIndex; i < this.getVideosCount() &&  i < startIndex+rowsPerPage; i++){
            videos.push({
                "title": "title"+(i+1), 
                "size": Math.floor(Math.random() * 500)+1,
                "uploadDate": this._getFormattedDate(this._subtractDays(date, Math.random() * 50+1))
            });
       }

       return videos;
    }  

    getVideosCount(){
        return 100;
    }

    _getFormattedDate(date){
        let formattedDate = date.getFullYear();

        formattedDate += "-";

        if(date.getMonth() < 10){
            formattedDate += "0";
        }

        formattedDate += date.getMonth();
        formattedDate += "-";

        if(date.getDate() < 10){
            formattedDate += "0";
        }

        formattedDate += date.getDate();

        return formattedDate;
    }

    _subtractDays(date, days){
        const copy = new Date(Number(date))
        copy.setDate(date.getDate() - days);
        return copy;
    }
}
