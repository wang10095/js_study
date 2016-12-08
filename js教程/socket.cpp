//1、首先起一个线程，来进行socket通信的连接
int GameServer::connectThreadStart(){
    //    connect(GAMESERVER, CCString::create(GAMESERVER_PORT)->intValue());
    
    int errCode = 0;
    do{
        pthread_attr_t tAttr;
        errCode = pthread_attr_init(&tAttr);
        
        CC_BREAK_IF(errCode!=0);
        
        errCode = pthread_attr_setdetachstate(&tAttr, PTHREAD_CREATE_DETACHED);
        
        if (errCode!=0) {
            pthread_attr_destroy(&tAttr);
            break;
        }
        errCode = pthread_create(&m_gameThread, &tAttr, connectSocket, this);
    }while (0);
    return errCode;
}
//2、连接socket代码：
void* GameServer::connectSocket(void* args)
{
    connect("192.168.1.2", "3343");
    return NULL;
}
//再此处进行socket连接，如果连接成功之后，将会通知主线程，连接已经成功，此处我们使用了cocos2dx高级开发教程中封装的MTNotificationQueue进行子线程向主线程的通信
int GameServer::connect(const char* ip, unsigned int port)
{
    CCLOG("Client begin connect IP: %s:%d ",ip,port);
    struct sockaddr_in sa;
    struct hostent* hp;
    
    hp = gethostbyname(ip);
    if(!hp){
        return -1;
    }
    memset(&sa, 0, sizeof(sa));
    memcpy((char*)&sa.sin_addr, hp->h_addr, hp->h_length);
    sa.sin_family = hp->h_addrtype;
    sa.sin_port = htons(port);
    
    m_socketHandle = socket(sa.sin_family, SOCK_STREAM, 0);
    
    if(m_socketHandle < 0){
        printf( "failed to create socket\n" );
        return -1;
    }
    if(::connect(m_socketHandle, (sockaddr*)&sa, sizeof(sa)) < 0){
        printf( "failed to connect socket\n" );
        ::close(m_socketHandle);
        return -1;
    }
    
    CCLOG("Client connect OK ！ IP: %s:%d ",ip,port);
    
    MTNotificationQueue::sharedNotificationQueue()->postNotification("connectok", NULL);
    return 0;
}
//3、通知主线程之后，主线程将会负责开启新的线程进行recv监听，监听服务器下发的数据
void GameServer::initReceiveThread(CCObject* obj)
{
    int errCode = 0;
    pthread_attr_t tAttr;
    errCode = pthread_attr_init(&tAttr);
    
    errCode = pthread_attr_setdetachstate(&tAttr, PTHREAD_CREATE_DETACHED);
    
    if (errCode!=0) {
        pthread_attr_destroy(&tAttr);
    }else{
        errCode = pthread_create(&m_gameThread, &tAttr, listenSocketData, this);
    }
    if(errCode == 0){
        CCLOG("Receive Thread OK!!!");
    }else{
        CCLOG("Receive Thread Error!!!!");
    }
    
    MTNotificationQueue::sharedNotificationQueue()->postNotification("jointable", NULL);
}
//开启socket通信接收函数
void* GameServer::listenSocketData(void* obj)
{
    byte buffer[5];
    string contents;
    int ret = 0;
    // 先接受4字节，获取服务返回长度
    bool rs = true;
    while(rs)
    {
        contents = "";
        ret = recv(m_socketHandle,buffer,4,0);
        // 服务器关闭
        if(ret == 0)
        {
            //            CCLog("Error: server close");
            rs = false;
        }
        if(ret == 4)
        {
            buffer[4]='\0';
            int packetlen = Utils::bytes2int(buffer);
            CCLOG("packetlen %d",packetlen);
            char buf[packetlen];
            int rets = 0;
            while((ret = recv(m_socketHandle,buf,packetlen-rets,0))>0)
            {
                contents.append(buf,ret);
                packetlen-=ret;
                if(packetlen<=0)
                    break;
            }
            CCLog("recv content:%s\n",contents.c_str());
            CCString* str = CCString::create(Utils::getUnPackMsg(contents));
            MTNotificationQueue::sharedNotificationQueue()->postNotification("receivedata", str);
        }else {
            CCLog("Error: recv data Error %d",ret);
        }
    }
    return NULL;
}
//因为我们的cocos2dx客户端与服务器端约定，发送的前四个字节作为发送内容的字节长度，因此首先接收前四个字节，至此，一个多线程socket程序就完成了














