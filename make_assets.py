from PIL import Image, ImageDraw, ImageFilter
import random, math
root='packages/web/public/images/'
im=Image.open(root+'dream-big.png').convert('RGB')
w,h=im.size
mask=Image.new('L',(1000,563)); d=ImageDraw.Draw(mask)
d.polygon([(52,146),(80,139),(212,146),(332,148),(415,146),(515,173),(649,220),(763,252),(947,258),(806,270),(748,284),(678,318),(590,344),(553,350),(582,427),(560,432),(477,397),(414,352),(384,403),(362,419),(336,405),(310,345),(245,319),(164,265),(92,211),(53,176)],fill=200)
mask=mask.resize((w,h)).filter(ImageFilter.GaussianBlur(12)); mask.save(root+'depth.png')
random.seed(17)
cloud=Image.new('RGBA',(512,256)); d=ImageDraw.Draw(cloud)
for i in range(60):
    x=random.randint(100,410); y=random.randint(70,200); r=random.randint(30,75)
    d.ellipse((x-r,y-r,x+r,y+r),fill=(255,207+random.randint(0,22),236,random.randint(12,45)))
cloud=cloud.filter(ImageFilter.GaussianBlur(22)); cloud.save(root+'cloud.png')
im.crop((0,int(h*.8),w,h)).save(root+'cloud-floor.png')