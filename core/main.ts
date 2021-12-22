import puppeteer from 'puppeteer-core';//模拟操作
import moment from 'moment';// 时间
import YAML from 'yamljs'; //读取配置文件
import fs from "fs"; // 解析
// import sendMail from './mail'; //发送邮件

const yaml_file = "./main.yml" //配置文件路径
const data = YAML.parse(fs.readFileSync(yaml_file).toString());

async function my_main(_user: any, test: boolean) {
  const browser = await get_mybrowser();

  try {
    // 打卡浏览器
    console.log(moment(Date.now()).format('YYYY/MM/DD HH:mm:ss') + ":开始填报" + "----" + String(_user['username']))

    const page = await browser.newPage()

    await page.goto('http://jkrb.xjtu.edu.cn/EIP/user/index.htm')

    // 登陆
    const username = await page.waitForSelector('.main > .main_info > .loginState > #form1 > .username')
    if (username) {
      await username.type(String(_user['username']), { delay: 10 });
    }
    const password = await page.waitForSelector('.main > .main_info > .loginState > #form1 > .pwd')
    if (password) {
      await password.type(String(_user['password']), { delay: 10 });
    }

    await page.waitForSelector('.organizational #account_login')
    await page.click('.organizational #account_login')
    console.log("login date:" + moment(Date.now()).format('YYYY/MM/DD HH:mm:ss') + "----" + String(_user['username']))

    // 类别
    let frame = await page.waitForFrame(f => f.url().includes('/elobby/service/portlet.htm'))
    if (_user['type'] === "研究生") {
      // 选择研究生填报
      await frame.waitForSelector('#form > div.service-wrap > div > ul.service-hall.hottest-services > li:nth-child(1) > div > a > div > div')
      await frame.click('#form > div.service-wrap > div > ul.service-hall.hottest-services > li:nth-child(1) > div > a > div > div')
      console.log("type = 研究生:" + moment(Date.now()).format('YYYY/MM/DD HH:mm:ss') + "----" + String(_user['username']))
    } else if (_user['type'] === "本科生") {
      // 选择本科生填报
      await frame.waitForSelector('#form > div.service-wrap > div > ul.service-hall.hottest-services > li:nth-child(2) > div > a > div > div')
      await frame.click('#form > div.service-wrap > div > ul.service-hall.hottest-services > li:nth-child(2) > div > a > div > div')
      console.log("type = 本科生:" + moment(Date.now()).format('YYYY/MM/DD HH:mm:ss') + "----" + String(_user['username']))
    } else {
      console.log("_user['type']: " + _user['type'] + "输入有误");
    }

    //选择每日健康填报
    frame = await page.waitForFrame(f => f.url().includes('/elobby/service/start.htm'))
    await frame.waitForSelector('body > div > div.service-right-sidebar > div.service-entrance > ul > li:nth-child(1)')
    await frame.click('body > div > div.service-right-sidebar > div.service-entrance > ul > li:nth-child(1)')

    // // 开始填报
    // console.log("begin to fill form" + moment(Date.now()).format('YYYY/MM/DD HH:mm:ss') + "----" + String(_user['username']))
    // frame = await page.waitForFrame(f => f.url().includes('/elobby/service/start.htm'))
    // await frame.waitForSelector("#mini-2\\$1")
    // await frame.click("#mini-2\\$1")
    // const random = Math.floor(Math.random() * 10);
    // await frame.waitForSelector("#BRTW\\$text");
    // await frame.type("#BRTW\\$text", "36." + random, { delay: 10 });

    // await frame.evaluate((_user) => {
    //   // 没有去过高风险地区

    //   document.querySelector<HTMLElement>("#mini-2\\$1")?.click();
    //   // 已经阅知
    //   // document.querySelector("#mini-4\\$ck\\$0").click();
    //   // 随机温度
    //   var random = Math.floor(Math.random() * 10);
    //   // 绿色 
    //   // document.querySelector("#mini-2\\$ck\\$2").click()
    //   // 已取得西安市一码通
    //   // document.querySelector("#mini-3\\$ck\\$0").click();
    //   // 哪个校园
    //   // document.querySelector("#SZXQ\\$value").value = _user['campus']
    //   // 36.5 
    //   const inputEle = document.querySelector<HTMLInputElement>("#BRTW\\$text");
    //   if (inputEle) {
    //     inputEle.value = "36." + random
    //   }
    //   // mini.get("BRTW").value = "36." + random
    //   // 所在学院
    //   // document.querySelector("#SZXY\\$text").value = _user['school']
    //   // mini.get("SZXY").value = _user['school']
    // }, _user)

    //上午下午
    // const x_y=(await (await frame_51.$("#SXW > .mini-buttonedit-border > .mini-buttonedit-buttons > .mini-buttonedit-button")).boundingBox());
    // await page.mouse.move(x_y['x'],x_y['y']);
    // await page.mouse.down();
    // await page.mouse.up();
    // if (new Date().getHours() < 12) {
    //   frame_51.click('.mini-grid-rows-content > .mini-listbox-items > tbody > #mini-72\\$0 > td:nth-child(2)')
    // }else{
    //   // document.querySelector("#SXW\\$value").value="下午"
    //   // mini.get("SXW").value="下午"
    //   frame_51.click('.mini-grid-rows-content > .mini-listbox-items > tbody > #mini-72\\$1 > td:nth-child(2)')
    // }


    // // 提交按钮
    // const frames4 = page.frames()
    // const frame_53 = frames4.find(f => f.url().includes('/EIP/cooperative/openCooperative.htm'))
    // if (frame_53) {
    //   await frame_53.waitForSelector('table #sendBtn')
    //   await frame_53.click('table #sendBtn')
    // }

    // 截图
    await page.waitForNetworkIdle()
    await page.screenshot({ path: "C:/Users/dylan/Desktop/" + moment(Date.now()).format('YYYY-MM-DD-HH-mm-ss') + "_1.png" });//截个图

    // // 确定按钮
    // await page.waitForTimeout(sleepTime)
    // const frames5 = page.frames()
    // const frame_5_1 = frames5.find(f => f.url().includes('cooperative/openCooperative.htm'))
    // // 确定
    // if (frame_5_1) {
    //   const done = await frame_5_1.waitForSelector("#mini-17")
    //   await done?.click()
    // }
    // // 截图
    // var screenshot_dir_2 = moment(Date.now()).format('YYYY-MM-DD-HH-mm-ss') + "_2.png"
    // await page.screenshot({ path: screenshot_dir_2 });//截个图
    // await page.waitForTimeout(sleepTime)
    // //验证打卡成功否
    // await page.waitForTimeout(sleepTime)
    // const frame_55 = await page.waitForFrame(f => f.url().includes('/elobby/service/start.htm'))
    // await frame_55.waitForSelector('.service-right-sidebar > .service-entrance > ul > .bl-item:nth-child(2) > .business-btn-text')
    // await frame_55.click('.service-right-sidebar > .service-entrance > ul > .bl-item:nth-child(2) > .business-btn-text')
    // await browser.close()
    // console.log(moment(Date.now()).format('YYYY/MM/DD HH:mm:ss') + ":结束填报" + "----" + String(_user['username']))
    // // 发送邮件
    // sendMail(_user['revMail'], "打卡成功 Clock Successfully ", screenshot_dir_2, "./" + screenshot_dir_2)
    return true;

  } catch (err) {
    console.log(err);
    if (test) {
      await browser.close()
    }
    return false
  }

}

const get_mybrowser = () => puppeteer.launch({
  slowMo: 20,    //放慢速度
  headless: data['config']['noShowUI'],
  defaultViewport: {
    width: 1540,
    height: 1080,
    hasTouch: true,
    isMobile: false,
    // deviceScaleFactor: 3,
  },
  // ignoreHTTPSErrors: false, //忽略 https 报错
  // args: [`--window-size=${1540},${1080}`, '--no-sandbox', '--disable-setuid-sandbox', '--start-fullscreen'], //全屏打卡页面
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
});


async function my(test: boolean) {
  //  遍历users
  let user_list = Array(data['users'])[0].concat();

  for (let _ in user_list) {
    const user = user_list.pop();

    // 尝试3次
    for (let index = 0; index < 3; index++) {
      const result = await my_main(user, test)
      if (result) {
        console.log("------- 打卡成功 -------")
        break;
      } else {
        console.log(`------- 打卡失败: ${index + 1}/3 -------`)
        console.log(moment(Date.now()).format('YYYY/MM/DD HH:mm:ss') + ":结束填报,打卡失败" + "----" + String(user['username']))
      }
    }
  }
}

export default my;
