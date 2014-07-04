import math



def getPosition(dataList):
	base = 1.05
	myList = []
	totalRadius = 0 
	for r,w,d in dataList:
		totalRadius+=math.log(r,base)
	height = 650
	padding = 30

	yWeight = (height -2*padding)/float(2*totalRadius)
	if 2*totalRadius < (height -2*padding):
		rWeight = 1
	else:
		rWeight = yWeight
	y=padding
	for r,w,d in dataList:
		r = math.log(r,base)
		newR = r * rWeight
		y+= r * yWeight
		date = getDate(d,y)
		y += r * yWeight
		myList.append((newR,w,date))
	return myList
	

	


def middleSort(dataList):
	myList = dataList
	dataList = sorted(dataList,reverse = True)
	#print len(myList)
	
	i=0
	n = len(dataList)/2
	if len(dataList) %2 == 0:
		n-=1
	gate = -1
	for data in dataList:
		#print n+i*gate
		myList[n+i*gate] = data
		if gate == -1:
			i+=1
		gate = -gate
	return myList


def getDate(date,y ="410"):
	if int(date)<10:
		date ='0'+date
	return "[new Date(\"2013-04-"+date+"\"),"+str(y)+"]"



def getSuperDate(dateList):
	height = 600
	padding = 50
	countDate={}

	for date in dateList:
		countDate[date]=countDate.get(date,0)+1
	superDate = '['
	countTimes={}
	for date in dateList:
		density = countDate[date]
		countTimes[date]=countTimes.get(date,0)+1
		unit =  (height-2*padding) / density 
		y = countTimes[date] * unit+padding
		superDate += getDate(date,y)+',\n'



	return superDate+']'

def getWords(w):
	w = w.split(' ')
	words = '[' 
	countDown = 10
	for word in w:
		words=words+'[\"'+word+"\","+str(countDown)+",],"
		if countDown > 5:
			countDown -=1
	return words+']'

def getRadius(r):

	return str(int(math.sqrt(float(r))))


def getAllPositions(dataList):
	print 'var position = ['
	for r,w,xy in dataList:
		print xy+','
	print '];'

def getAllRadius(dataList):
	print 'var radius = ['
	for r,w,xy in dataList:
		print str(r)+','
	print '];'

def getAllWords(dataList):
	print 'var wordSet = ['
	for r,w,xy in dataList:
		print getWords(w)+','
	print '];'


f = open('tmp2','r')
groupDate ={}
for line in f:
	term = line.split('\t')
	#print term
	r,w,d = line.split('\t')

	r = int(r)
	w = w[2:]
	d = d[:len(d)-1]
	groupDate[d] = groupDate.get(d,[])+[(r,w,d)]
	#print r,w,d
for key in groupDate.keys():
	groupDate[key] = getPosition(middleSort(groupDate[key]))
bigList=[]
for key in groupDate.keys():
	bigList+=groupDate[key]
getAllRadius(bigList)
getAllPositions(bigList)
getAllWords(bigList)







'''
f = open('tmp','r')
count={}
for line in f:
	r,w,d = line.split('\t')
	count[d[:len(d)-1]]=count.get(d[:len(d)-1],0)+1


for key in count.keys():
	print key,count[key]
'''

'''
f = open('tmp','r')
dateList=[]
for line in f:
	r,w,d = line.split('\t')
	dateList.append(d[:len(d)-1])
print getSuperDate(dateList)
'''

'''
f = open('tmp','r')
print '['
for line in f:
	r,w,d = line.split('\t')
	print getRadius(r)+','
print ']'
'''

'''
print '['
for line in f:
	r,w,d = line.split('\t')
	print getDate(d[:len(d)-1])+','

print ']'
'''

#a = [(1,0),(2,0),(3,0),(4,0),(5,0)]
#print middleSort(a)