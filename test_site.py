import asyncio, json
from playwright.async_api import async_playwright

async def main():
 async with async_playwright() as p:
  browser=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox','--enable-webgl','--use-gl=angle','--use-angle=swiftshader'])
  page=await browser.new_page(viewport={'width':1440,'height':900},device_scale_factor=1)
  errors=[]
  page.on('pageerror',lambda e:errors.append(str(e)))
  await page.goto('http://localhost:4200',wait_until='networkidle')
  await page.wait_for_timeout(2500)
  await page.screenshot(path='/home/user/safo-hero.png')
  await page.get_by_role('button',name='Go to Projects',exact=True).click()
  await page.wait_for_timeout(2500)
  await page.screenshot(path='/home/user/safo-projects.png')
  await page.locator('.project-card').first.click()
  await page.get_by_role('dialog').wait_for()
  await page.screenshot(path='/home/user/safo-modal.png')
  assert await page.get_by_role('link',name='Launch Live App').get_attribute('href')=='https://vercel.app'
  await page.keyboard.press('Escape')
  await page.get_by_role('button',name='Go to Contact',exact=True).click()
  await page.wait_for_timeout(2200)
  await page.locator('input[name=name]').fill('Portfolio QA')
  await page.locator('input[name=email]').fill('qa@example.com')
  await page.locator('textarea').fill('Test message: portfolio contact form verification.')
  await page.get_by_role('button',name='Send a message',exact=True).click()
  await page.get_by_role('status').wait_for(timeout=20000)
  await page.screenshot(path='/home/user/safo-contact.png')
  await page.get_by_role('button',name='Quick View',exact=True).click()
  await page.wait_for_timeout(1500)
  assert await page.locator('.quick-mode').count()==1
  assert await page.locator('canvas').count()==0
  await page.screenshot(path='/home/user/safo-quick.png')
  await page.get_by_role('button',name='3D Experience',exact=True).click()
  await page.wait_for_timeout(1500)
  mobile=await browser.new_page(viewport={'width':390,'height':844},device_scale_factor=1,is_mobile=True,has_touch=True)
  await mobile.goto('http://localhost:4200',wait_until='networkidle')
  await mobile.wait_for_timeout(2000)
  await mobile.screenshot(path='/home/user/safo-mobile.png')
  overflow=await mobile.evaluate('document.documentElement.scrollWidth > window.innerWidth')
  print(json.dumps({'errors':errors,'mobileOverflow':overflow,'modal':'passed','contact':'saved','quickView':'passed'}))
  await browser.close()
asyncio.run(main())