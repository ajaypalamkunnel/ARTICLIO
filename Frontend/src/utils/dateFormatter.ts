
export const dateFormatter = (date:Date|string)=>{
    const formattedDob = new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return formattedDob

}
