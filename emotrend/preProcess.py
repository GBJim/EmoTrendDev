import math

def getDate(date,y ="410"):
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
		unit =  (height-padding) / density 
		y = countTimes[date] * unit
		superDate += getDate(date,y)+',\n'



	return superDate+']'

def getWords(w):
	w = w.split(' ')
	words = '[' 
	for word in w:
		words=words+'[\"'+word+"\",5],"
	return words+']'

def getRadius(r):

	return str(int(math.sqrt(float(r))))




f = open('tmp','r')
dateList=[]
for line in f:
	r,w,d = line.split('\t')
	dateList.append(d[:len(d)-1])
print getSuperDate(dateList)


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