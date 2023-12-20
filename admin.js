import { admin } from "./app.js";
import { readGoogle, writeGoogle } from './google.js';
import { dataBot } from './values.js';

let photoGallery = [];

const postMessageDesign = (data, status = null) => {

  const condition = data[1].split(" ");
  let percentage = condition[1];
  if (!percentage) percentage = '100%';
  const housing = condition[0];

  let message = `<b><i>Apple iPhone ${data[0]} Neverlock</i>\n
◾️Батарея: ${percentage}  
◾️Стан: ${housing}  
◾️Ціна: ${data[2]}</b> 

🖼️Наш інстаграм: instagram.com/tatko.jobs
♻️Trade In (Обмін зі старого пристрою на новий з вашою доплатою)
💰ОПЛАТА ЧАСТИНАМИ
🚘Доставка по місту
📦 Відправлення Новою Поштою по Україні`
;

  if (status === 'sold') {
    message += '\n\n<b>⚔️SOLD⚔️</b>';
  }

  return message;
};

const createPhotoArray = (data, lotInformation) => {
  const photoArray = data.map((item, index) => {
    if (index === data.length - 1) {
      return {
        type: 'photo',
        media: item,
        caption: postMessageDesign(lotInformation),
        parse_mode: 'HTML',
      };
    } else {
      return {
        type: 'photo',
        media: item,
      };
    }
  });

  return photoArray;
}


export const adminListiner = async () => {

    admin.on('message', async (msg) => {

        const text = msg.text; 
        if (!isNaN(parseFloat(text))) {

          const lotInformation = await readGoogle(`${text}:${text}`);

          if (photoGallery.length == 0) {
              photoGallery = [
              'AgACAgIAAxkBAAIBMWVfZ8ZRu1sTedLEE_GymCy2_ON5AAIT1jEblIz4SoMCqtcy3fyZAQADAgADeQADMwQ',
              'AgACAgIAAxkBAAIBMGVfZ8ZWNwsAAXvPIxHM1s4xw-Zk3QACEtYxG5SM-Ep1U2KlWCkQHAEAAwIAA3kAAzME'
              ];
          } 

          const media = createPhotoArray(photoGallery, lotInformation)
          
          try {
            const messagePost = await admin.sendMediaGroup(dataBot.channelId, media);
            const msgg = await writeGoogle(`K${text}`, [[messagePost[messagePost.length - 1].message_id]]);
            photoGallery = [];  
          } catch (error) {
            console.log(error.response.body);
          }
        }
        if (text) {
          if  (msg.text.startsWith('del')) {
            const lotNumber = msg.text.replace('del', '').trim();
            const newdata = await readGoogle(`${lotNumber}:${lotNumber}`);
            try {
              if (newdata[10]) {
                admin.editMessageCaption(
                  postMessageDesign(newdata, 'sold'), {
                    message_id: newdata[10],
                    chat_id: dataBot.channelId,
                    parse_mode: 'HTML',
                  });  
              }
            } catch (error) {
              console.log(error)
            }
          }
        }
    });

    admin.on('photo', (msg) => {
      const photoId = msg.photo[msg.photo.length - 1].file_id;
      photoGallery.push(photoId);
    });
}
