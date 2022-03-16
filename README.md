# 电子班牌系统
```
    npm run serve
    npm run build
```


#build
初始化一个cordova项目  
把vue.config.js 里的输出目录 outputDir 改成cordova项目下的www即可  
然后执行build， 再去cordova项目执行cordova build android即可  
调试打包apk都使用androidStudio  
  
  
  
  
  
打包后在MainActivity位置新建一个StartBootReceiver类

```java
package com.hzmaijie.banpai;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;


public class StartBootReceiver extends BroadcastReceiver {
    String ACTION = "android.intent.action.BOOT_COMPLETED";

    @Override
    public void onReceive(Context context, Intent intent) {
        if (ACTION.equals(intent.getAction())) {
            Intent main = new Intent(context, MainActivity.class);
            main.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            context.startActivity(main);
        }
    }
}
```

然后修改AndroidManifest.xml, 在application标签中添加以下receiver，用于接收开机自启事件。加上 __开机自启权限__  
并且修改activity标签中的intent-filter内容为以下内容，用于设置为桌面项目，也叫启动器， 在android设备中设置默认应用，默认桌面为该应用。
```xml
<application>
    <receiver android:enabled="true" android:exported="true" android:name="com.hzmaijie.banpai.StartBootReceiver"> <!-- add -->
        <intent-filter>                                                                     <!-- add -->
            <action android:name="android.intent.action.BOOT_COMPLETED"/>                   <!-- add -->
            <category android:name="android.intent.category.HOME"/>                         <!-- add -->
            <category android:name="android.intent.category.DEFAULT"/>                      <!-- add -->
            <category android:name="android.intent.category.LAUNCHER"/>                     <!-- add -->
        </intent-filter>                                                                    <!-- add -->
    </receiver>                                                                             <!-- add -->
    <activity>
        <intent-filter>
            <action android:name="android.intent.action.MAIN"/>
            <category android:name="android.intent.category.HOME"/>     <!-- add -->
            <category android:name="android.intent.category.DEFAULT"/>  <!-- add -->
            <category android:name="android.intent.category.LAUNCHER"/>
        </intent-filter>
    </activity>
</application>
```
```xml
<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
```
