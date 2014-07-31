## 项目组成员
android：罗琦 李顺 蒲攀(负责人：罗琦)

ios：刘美娜 黄恒发 陈晓垚（20%-50%）(负责人: 刘美娜)

项目组长:李顺

备注：由于部分成员可能会有多个项目，请自行安排进度，ios开发可以滞后android

## 基本开发流程：
* 根据需求文档 分解 features （每个feature是完整且最小的功能点）

* developer选择一个feature进行开发：

    1. 建立feature branch（例如：login）
    2. 开发（含单元测试[UI测试], 不需要每个接口测试 但是复杂的业务接口需要进行测试，每次review前必须要保证测试全部通过）...
    3. 发merge request（feature branch to dev branch）（指定给另一开发人员、@其他相关开发人员）
    4. review
      ios: lmn chengxy
      android： luoq lis
    5. 由指定人员完成merge、删除feature branch
    
    
* 冒烟测试
    
* 迭代（一周一个迭代）
	* 测试
	    1. 项目组长制作milestone
	    2. 当milestone设定的功能达到要求后，组长（或指定人员）merge dev to master
	    3. 测试做系统测试
   
* release流程

## 基本开发原则
* 开发必须要保证系统 接口可测试（耦合度足够低[综合评估]）
* restapi方面，和服务端集成之前, 统一利用mock数据开发，每个mock数据定义一个json文件，mock代码可提交，集成时替换为正式数据
