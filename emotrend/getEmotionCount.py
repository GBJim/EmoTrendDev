import glob
import os
import operator

def getOneDay(emotionCount,date):
	#print date
	if int(date)<10:
		date = '0'+date 
	myString = '{'
	emotionList = ['sadness','anticipation','disgust','surprise','anger','joy','fear','trust']
	for emotion in emotionList:
		myString = myString + "\""+emotion+"\":"+str(emotionCount[emotion])+','
	return myString+"\"date\":\"04/"+date+"/2013\"}"


folders =   [x[0] for x in os.walk('./')]
folders = folders[1:]
currentPath = os.getcwd()

'''
for filename in os.listdir(currentPath):
	print filename
'''




for directory in folders:
	w = open(directory[2:]+'.json','w')
	w.write('[')
	first =True
	for txt in glob.glob(os.path.join(currentPath+directory[1:], '*.txt')):
		f_name=txt.rsplit('/')[-1].rsplit('.')[0]
		#print txt

		emotionCount = {'anticipation':0, 'joy': 0, 'sadness': 0, 'disgust':0, 'anger': 0, 'surprise':0, 'fear':0, 'trust': 0}

		f = open(txt,'r')
		for line in f:
			term = line.split('\t')
			emotion = term[1][:len(term[1])-2]
			if emotion == 'not determined':
				continue
			emotionCount[emotion]=emotionCount.get(emotion,0)+1

		if not first:
			w.write(',')
		first = False
		w.write( getOneDay(emotionCount,f_name))
	w.write(']')
	w.close()
	'''
	for key in emotionCount.keys():
		w.write(key)
		w.write(emotionCount[key])
	w.close()
	'''
	

	
	

'''
sortedMap = sorted(eventMap.iteritems(),key=operator.itemgetter(1))
for event,user in sortedMap:
	w.write(str(user)+'\t'+event+'\n')

w.close()
'''