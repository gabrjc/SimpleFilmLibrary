const dayjs=require('dayjs')
class Film {
  constructor(
    Id,
    Title,
    Favorite = false,
    Watch_date = undefined,
    Score = undefined
  ) {
    if (typeof Id != "number" || typeof Title != "string") return;
    this.Id = Id;
    this.Title = Title;
    this.Favorite = Favorite;

    if (Watch_date !== undefined) this.Watch_date = dayjs(Watch_date);
    else this.Watch_date = undefined;

    this.Score = Score;
  }
  invertFav() {
    this.Favorite = !this.Favorite;
  }
  setScore(n){
    this.Score=n;
  }

  last30day() {
    if (this.Watch_date === undefined) return false;
    let today = new Date();
    let now = Date.parse(today);
    let WD = Date.parse(this.Watch_date);
    const thirtyday = 2592000000;
    if (now - WD > thirtyday) return false;
    else return true;
  }

  copy(){
    return new Film(this.Id,this.Title,this.Favorite,this.Watch_date,this.Score);
  }
}

export default Film;
