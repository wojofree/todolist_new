<template>
  <div style="width: 100%; background-color: black">
    <div style="width: 750px; padding: 0 40px;margin: 40px 0;background-color: white;">
      <HeadingTwo :option="this.heading"></HeadingTwo>
      <HeadingThree :option="this.heading"></HeadingThree>
      <HeadingOne :option="this.headingOne"></HeadingOne>
      <button @click="changeData">更新数据</button>
      <BarChartMultiple :option="barChartVertical"></BarChartMultiple>
      <BarChartVertical :option="barChartVertical"></BarChartVertical>
      <BarChartHorizontal :option="barChartHorizontal"></BarChartHorizontal>


      <ProgressBarOne
          :option=this.progress
      ></ProgressBarOne>

      <ProgressBarTwo
          :option=this.progress
      ></ProgressBarTwo>
      <FunnelChart :option=this.funnelTest></FunnelChart>
    </div>
  </div>


  <div style="display: flex; justify-items: flex-start; background-color: #dee2e6;">
    <button @click="convertToCanvas">导出图片</button>
  </div>
  <div ref="main" class="test-main">
    <!--    扇形图-->
    <div ref="pieHalf" class="chat-swap backIMG">
      <v-chart :option="pieLargeOption(180, {})" className="chart"/>
    </div>

    <!--    饼图大-->
    <div ref="pieLarge1" class="chat-swap">
      <v-chart :option="pieLargeOption(0, itemStyle)" className="chart"/>
    </div>

    <!--    饼图中-->
    <div class="chat-swap display-flex height-fit gap-40">
      <div class="pie-item-swap">
        <div class="title-swap">
          <div class="border-new"></div>
          <div class="title">职业分布地方</div>
        </div>
        <div ref="pieMedium1" class="chart-1">
          <v-chart :option="pieMediumAndSmallOption" className="chart"/>
        </div>
      </div>

      <div class="pie-item-swap">
        <div class="title-swap">
          <div class="border-new"></div>
          <div class="title">职业分布地方</div>
        </div>
        <div ref="pieMedium2" class="chart-1">
          <v-chart :option="pieMediumAndSmallOption" className="chart"/>
        </div>
      </div>
    </div>

    <!--    饼图小-->
    <div class="chat-swap display-flex height-fit gap-20">
      <div class="pie-item-swap">
        <div class="title-swap">
          <div class="border-new"></div>
          <div class="title">职业分布</div>
        </div>
        <div ref="pieSmall1" class="chart-2">
          <v-chart :option="pieMediumAndSmallOption" className="chart"/>
        </div>
      </div>
      <div class="pie-item-swap">
        <div class="title-swap">
          <div class="border-new"></div>
          <div class="title">职业分布</div>
        </div>
        <div ref="pieSmall2" class="chart-2">
          <v-chart :option="pieMediumAndSmallOption" className="chart"/>
        </div>
      </div>
      <div class="pie-item-swap">
        <div class="title-swap">
          <div class="border-new"></div>
          <div class="title">职业分布</div>
        </div>
        <div ref="pieSmall3" class="chart-2">
          <v-chart :option="pieMediumAndSmallOption" className="chart"/>
        </div>
      </div>
    </div>

    <!--    渐变色单系列柱状图-->
    <div ref="linearBar" class="chat-swap height-320">
      <v-chart :option="linearBarOption" className="chart"/>
    </div>

    <!--    纯色单or多系列柱状图-->
    <div ref="multipleBar" class="chat-swap height-320">
      <v-chart :option="multipleBarOption" className="chart"/>
    </div>

    <!--    折线图-->
    <div ref="line" class="chat-swap height-320">
      <v-chart :option="lineOption" className="chart"/>
    </div>

    <!--    散点图-->
    <div ref="scatter" class="chat-swap height-500">
      <v-chart :option="scatterOption" className="chart"/>
    </div>
  </div>
</template>
<script setup>
import {reactive, ref} from 'vue';
import {use} from 'echarts/core';
import {SVGRenderer} from 'echarts/renderers';
import {BarChart, LineChart, PieChart, ScatterChart} from 'echarts/charts';
import {DatasetComponent, GridComponent, LegendComponent,} from 'echarts/components';
import VChart from 'vue-echarts';
import ProgressBarOne from "@/components/common/ProgressBarOne";
import ProgressBarTwo from "@/components/common/ProgressBarTwo";
import FunnelChart from "@/components/common/FunnelChart";
import HeadingOne from "@/components/common/HeadingOne";
import HeadingTwo from "@/components/common/HeadingTwo";
import HeadingThree from "@/components/common/HeadingThree";
import BarChartHorizontal from "@/components/common/BarChartHorizontal";
import BarChartVertical from "@/components/common/BarChartVertical";
import BarChartMultiple from "@/components/common/BarChartMultiple";




use([
  SVGRenderer,
  PieChart,
  BarChart,
  LegendComponent,
  GridComponent,
  DatasetComponent,
  LineChart,
  ScatterChart,
]);

const pieLargeOneData = [
  ['name', 'value'],
  ['虎丘区测试', 46.39],
  ['吴中区', 13.26],
  ['相城区', 7.46],
  ['姑苏区', 6.47],
  ['吴江区', 3.17],
  ['昆山市', 2.56],
  ['其他测试', 0.7]
]

const pieSmallData = [
  ['name', 'value'],
  ['虎丘区', 46.39],
  ['吴中区', 13.26],
  ['相城区', 7.26],
]

function pieLargeOption(stratAngle, itemStyle) {
  return reactive({
    dataset: {
      source: pieLargeOneData
    },
    animation: false,
    series: [
      {
        type: "pie",
        radius: ["40%", "75%"],
        startAngle: stratAngle,
        endAngle: 360,
        voidLabelOverlap: false,
        itemStyle: itemStyle,
        labelLine: {
          length: 10,
          length2: 10,
          showAbove: true
        },
        label: {
          show: true,
          color: '#000000',
          width: 75,
          fontSize: 14,
          formatter: '{b}: {d}%',
          position: 'outside',
          minMargin: 2,
          fontFamily: 'Source Han Sans CN',
          overflow: 'break',
          rotate: 0,
        },
      }
    ]
  });
}

const pieMediumAndSmallOption = ref({
  dataset: {source: pieSmallData},
  animation: false,
  series: [
    {
      type: "pie",
      radius: ["25%", "55%"],
      startAngle: 0,
      endAngle: 360,
      voidLabelOverlap: false,
      itemStyle: {
        borderRadius: 4,
        borderColor: '#ffffff',
        borderWidth: 1
      },
      labelLine: {
        length: 5,
        length2: 5,
        showAbove: true,
      },
      label: {
        show: true,
        color: '#000000',
        width: 42,
        fontSize: 11,
        formatter: '{b}: {d}%',
        position: 'outside',
        minMargin: 2,
        fontFamily: 'Source Han Sans CN',
        overflow: 'break',
        rotate: 0,
      }
    }
  ]
});

// 新增index，解决X轴重复问题
function formatData(data) {
  return data.map((item, index) => {
    const prefix = index === 0 ? 'index' : index;
    return [prefix, ...item];
  });
}

const linearBarData = [
  ['category', 'value'],
  ['20-29岁', 75.64],
  ['30-39岁', 41.42],
  ['40-49岁', 19.06],
  ['50-59岁', 11.41],
  ['60-69岁', 1.33],
  ['70岁以上', 0.96]
]

const newLinearBarData = formatData(linearBarData)

function commonGrid(top = 35) {
  return {
    left: 0,
    right: 1,
    bottom: 5,
    top: top,
    containLabel: true
  }
}

const linearBarOption = ref({
  dataset: {source: newLinearBarData},
  animation: false,
  color: [
    {
      type: 'linear',
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [{
        offset: 0, color: '#0C69FF'
      }, {
        offset: 1, color: 'rgba(12, 105, 255, 0.00)'
      }],
      global: false
    },
    {
      type: 'linear',
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [{
        offset: 0, color: '#FF7823'
      }, {
        offset: 1, color: 'rgba(255, 120, 35, 0.00)'
      }],
      global: false
    }
  ],
  grid: commonGrid(1),
  legend: {
    show: false
  },
  xAxis: [
    {
      boundaryGap: true,
      type: 'category',
      axisTick: {
        show: false,
      },
      axisLabel: {
        fontSize: 18,
        fontFamily: 'Source Han Sans CN',
        interval: 0, // 自定义
        formatter: (value) => newLinearBarData[value][1] || '',
        rotate: 0, //自定义 默认0
      },
    }
  ],
  yAxis: [
    {
      type: 'value',
      min: 0, //自定义
      max: null, // 自定义
      position: 'left',
      axisLabel: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      splitLine: {
        lineStyle: {
          type: [5, 6],
          dashOffset: 5
        }
      }
    }],
  series: newLinearBarData[0]
      .slice(2)
      .map((item) => ({
        name: item,
        colorBy: 'data',
        type: 'bar',
        yAxisIndex: 0,
        label: {
          show: true,
          position: 'top',
          valueAnimation: true,
          formatter: '{@value}%', // 符号自定义
          offset: [0, -5],
          fontSize: 18,
          fontFamily: 'Source Han Sans CN',
        },
        barMaxWidth: 36,
        encode: {x: 'index', y: item},
      }))
});

const multipleBarData = [
  ['category', '人流量', '消费量'],
  [1, 0, 0],
  [2, 0, 0],
  [3, 0, 0],
  [4, 0, 0],
  [5, 0, 0],
  [6, 0, 0],
  [7, 90, 60],
  [8, 50, 40],
  [9, 0, 0],
  [10, 0, 0],
  [11, 0, 0],
  [12, 0, 0],
]

const newMultipleBarData = formatData(multipleBarData)

const multipleBarOption = ref({
  dataset: {source: newMultipleBarData},
  animation: false,
  color: ['#87CEFA', '#FAC858', '#F0B858', '#D0B858'],
  grid: commonGrid(),
  legend: {
    right: '0',
    itemHeight: 11,
    itemWidth: 6,
    orient: 'horizontal',
    textStyle: {
      fontSize: 12,
      fontFamily: 'Source Han Sans CN',
    },
    top: '0'
  },
  xAxis: {
    type: 'category',
    axisLabel: {
      fontSize: 12,
      fontFamily: 'Source Han Sans CN',
      interval: 0, // 自定义
      formatter: (value) => newMultipleBarData[value][1] || '',
      rotate: 0, //自定义 默认0
    },
  },
  yAxis: {
    type: 'value',
    min: 0, // 自定义
    max: null, // 自定义
    axisLabel: {
      fontSize: 12,
      fontFamily: 'Source Han Sans CN',
      interval: 0,
      formatter: '{value}', // %
    },
  },
  series: newMultipleBarData[0]
      .slice(2)
      .map((item) => ({
        name: item,
        type: 'bar',
        datasetIndex: 0,
        barMaxWidth: 28.8,
        encode: {x: 'index', y: item},
      }))
});

const multipleLineData = [
  ['category', '7月', '8月'],
  ['周日', 3860, 4000],
  ['周一', 2216, 2606],
  ['周二', 2758, 2698],
  ['周三', 2722, 2414],
  ['周四', 2682, 3004],
  ['周五', 2700, 2344],
  ['周六', 4244, 3388],
  ['周日', 3210, 3238],
  ['周一', 2606, 2488],
  ['周二', 2874, 2710],
  ['周三', 3554, 2788],
  ['周四', 2638, 2424],
  ['周五', 2454, 2564],
  ['周六', 3622, 3210],
  ['周日', 4126, 3214],
  ['周一', 6722, 2458],
  ['周二', 2810, 2698],
  ['周三', 2760, 2756],
  ['周四', 2958, 2720],
  ['周五', 2800, 2738],
  ['周六', 3322, 3856],
  ['周日', 3356, 3564],
  ['周一', 2596, 2356],
  ['周二', 2340, 2738],
  ['周三', 2530, 2432],
  ['周四', 2806, 2790],
  ['周五', 2136, 2732],
  ['周六', 3142, 3394],
  ['周日', 4060, 3700],
  ['周一', 2606, 2764],
  ['周二', 2698, 2352],
  ['周三', 2414, 2554],
  ['周四', 3004, 2672],
  ['周五', 2344, 2550],
  ['周六', 3388, 2728],
]

const newMultipleLineData = formatData(multipleLineData)

const lineOption = ref({
  dataset: {source: newMultipleLineData},
  animation: false,
  color: [
    {
      type: 'linear',
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [{
        offset: 0, color: '#0C69FF'
      }, {
        offset: 1, color: 'rgba(12, 105, 255, 0.1)'
      }],
      global: false
    },
    {
      type: 'linear',
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [{
        offset: 0, color: '#FF7823'
      }, {
        offset: 1, color: 'rgba(255, 120, 35, 0.1)'
      }],
      global: false
    },
    {
      type: 'linear',
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [{
        offset: 0, color: '#C73FFF'
      }, {
        offset: 1, color: 'rgba(199, 63, 255, 0.1)'
      }],
      global: false
    },
    {
      type: 'linear',
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [{
        offset: 0, color: '#0FC995'
      }, {
        offset: 1, color: 'rgba(15, 201, 149, 0.1)'
      }],
      global: false
    },
    {
      type: 'linear',
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [{
        offset: 0, color: '#FF7823'
      }, {
        offset: 1, color: 'rgba(255, 120, 35, 0.1)'
      }],
      global: false
    }
  ],
  grid: commonGrid(),
  legend: {
    right: '0',
    top: '0',
    itemWidth: 18,
    itemHeight: 3,
    orient: 'horizontal',
    icon: 'roundRect',
    textStyle: {
      fontSize: 12,
      fontFamily: 'Source Han Sans CN',
    }
  },
  xAxis: {
    type: 'category',
    deduplication: false,
    axisLabel: {
      fontSize: 12,
      fontFamily: 'Source Han Sans CN',
      formatter: (value) => newMultipleLineData[value][1] || '',
      interval: 1, //自定义 默认0，空为null
      rotate: 0, //自定义 默认0
    }
  },
  yAxis: {
    type: 'value',
    min: 2000, // 自定义
    max: null, // 自定义
    axisLabel: {
      fontSize: 12,
      fontFamily: 'Source Han Sans CN',
      interval: 0,
    },
  },
  series: newMultipleLineData[0]
      .slice(2)
      .map((name) => ({
        name: name,
        type: 'line',
        smooth: true,
        showSymbol: false,
        lineStyle: {
          width: 3
        },
        encode: {x: 'index', y: name},
      }))
});

function convertDataToScatterObjects(data) {
  const output = [];

  data.slice(1).forEach((row, yIndex) => {
    row.forEach((value, xIndex) => {
      output.push({
        x: xIndex,
        y: yIndex + 1,
        value: xIndex === 0 ? 0 : value,
      });
    });
  });

  return output;
}

const scatterData = [
  ['date', '12a', '1a', '1a', '1a', '4a', '5a', '6a', '7a', '8a', '9a', '10a', '11a', '12p', '1p', '2p', '3p', '4p', '5p', '6p', '7p', '8p', '9p', '10p', '11p'],
  ['2024/8/1', '22', '2', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '11', '1', '1', '1', '1', '1', '1', '1', '1'],
  ['2024/8/2', '1', '2', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '20', '1', '1', '1', '1', '1', '1', '1', '1'],
  ['2024/8/3', '1', '2', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '19', '1', '1', '1', '1', '1', '1', '1', '1'],
  ['2024/8/4', '1', '3', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '18', '1', '1', '1', '1', '1', '1', '1', '1'],
  ['2024/8/5', '1', '3', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '17', '1', '1', '1', '1', '1', '1', '1', '1'],
  ['2024/8/6', '1', '4', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '16', '1', '1', '1', '1', '1', '1', '1', '1'],
  ['2024/8/7', '1', '5', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '15', '1', '1', '1', '1', '1', '1', '1', '1'],
  ['2024/8/8', '1', '6', '2', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '14', '1', '1', '1', '1', '1', '1', '1', '1'],
  ['2024/8/9', '1', '7', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '13', '1', '1', '1', '1', '1', '1', '1', '1'],
  ['2024/8/10', '1', '8', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '12', '1', '1', '1', '1', '1', '1', '1', '1'],
  ['2024/8/11', '1', '9', '1', '1', '1', '1', '3', '4', '5', '1', '1', '1', '1', '1', '1', '11', '1', '1', '1', '1', '1', '1', '1', '1'],
  ['2024/8/12', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '10', '1', '1', '1', '1', '1', '1', '1', '1'],
  ['2024/8/13', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '19', '1', '1', '1', '1', '1', '1', '1', '1'],
  ['2024/8/14', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '18', '1', '1', '1', '1', '1', '1', '1', '1'],
  ['2024/8/15', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '17', '1', '1', '1', '1', '1', '1', '1', '1'],
  ['2024/8/16', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '8', '1', '1', '16', '1', '1', '1', '1', '1', '1', '1', '1'],
  ['2024/8/17', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '15', '1', '1', '1', '1', '1', '1', '1', '1'],
  ['2024/8/18', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '14', '1', '10', '1', '1', '1', '1', '1', '1'],
  ['2024/8/19', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '13', '1', '1', '1', '1', '1', '1', '1', '1'],
  ['2024/8/20', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '12', '1', '11', '1', '1', '1', '1', '1', '1'],
  ['2024/8/21', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '23', '1', '1', '1', '1', '1', '1', '1', '1'],
  ['2024/8/22', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '23', '23', '23', '1', '1', '1', '1', '1', '1', '1'],
  ['2024/8/23', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '13', '1', '1', '1', '1', '1', '1', '1', '1'],
  ['2024/8/24', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '13', '1', '1', '1', '1', '1', '1', '1', '1'],
  ['2024/8/25', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '6', '1', '11', '1', '1', '1', '1', '1', '1', '1', '1'],
  ['2024/8/26', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '12', '1', '1', '1', '1', '1', '1', '1', '1'],
  ['2024/8/27', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '11', '1', '1', '17', '1', '1', '1', '1', '1', '1', '1', '1'],
  ['2024/8/28', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '17', '1', '1', '1', '1', '1', '1', '1', '1'],
  ['2024/8/29', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '19', '1', '1', '1', '1', '1', '1', '1', '1'],
  ['2024/8/30', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '11', '1', '1', '1', '1', '1', '1', '1', '1'],
  ['2024/8/31', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '12', '1', '1', '1', '1', '1', '1', '1', '1']
];

const newScatterData = convertDataToScatterObjects(scatterData);
const chartHeight = 500;
const yCount = scatterData.length - 1
const maxSymbolHeight = (chartHeight - (yCount * 2)) / yCount;  // 上下留一像素间距
const maxValue = Math.max(...newScatterData.map(item => item.value));
const unitSize = maxSymbolHeight / maxValue

const scatterOption = {
  dataset: {
    source: newScatterData,
  },
  color: ['#BDE0EA', '#000000'],
  animation: false,
  grid: {
    left: 0,
    right: 7,
    bottom: 5,
    top: 5,
    containLabel: true
  },
  xAxis: {
    type: 'category',
    axisLabel: {
      fontSize: 8,
      fontFamily: 'Source Han Sans CN',
      formatter: (value) => value === '0' ? '' : scatterData[0][value] || '',
    },
    axisTick: {
      lineStyle: {
        color: '#E0E6F1',
      }
    },
    axisLine: {
      show: false
    },
    boundaryGap: false,
    splitLine: {
      show: true
    },
  },
  yAxis: {
    type: 'category',
    axisLabel: {
      fontSize: 8,
      fontFamily: 'Source Han Sans CN',
      formatter: (value) => scatterData[value][0] || '',
    },
  },
  series: [
    {
      type: 'scatter',
      datasetIndex: 0,
      symbol: 'rect',
      symbolSize: function (val) {
        return val.value * unitSize;
      },
      encode: {x: 'x', y: 'y'},
    },
  ],
};

</script>
<script>

import html2canvas from "html2canvas";

export default {
  name: 'TestView',
  data() {
    return {
      chartHeight: '750px',
      itemStyle: {
        borderRadius: 8,
        borderColor: '#fff',
        borderWidth: 2
      },
      progress: {
        value: 0.95,
        leftCornerText: '左标1',
        rightCornerText: '右标',
      },
      heading: {text: '测试一下'},
      headingOne: {text: '测试一下', number: "01"},
      barChartHorizontal: {
        // labelSuffix: '%',
        data: [['总客流人数', 1], ['进店人数', 2.38], ['流人数', 0.00008], ['流人数1', 0.18], ['流人数2', 0.08]],
      },
      funnelTest: {data: [['总客流人数', 100], ['进店人数', 60], ['流人数1123', 30], ['流人数112', 15]]},
      barChartVertical: {
        data: [
          ['category', '7月', '8月'],
          ['20-29岁', 27.64, 37.64],
          ['30-39岁', 52, 47.64],
          ['40-49岁', 19.06, 27.64],
          ['50-59岁', 11.41, 17.64],
          ['60-69岁', 1.33, 22.64],
          ['70岁以上', 0.96, 9.64]
        ],
        color: 0,
        height: '350',
        yStart: 0,
        yEnd: null,
        xRotate: 'ceshi',
        xInterval: 0,
        isPercentage: true,
        isShowLabel: true,
        heading: '123123aaaaaa'
      },
    }
  },
  async mounted() {
    await this.$nextTick();
    this.getGElement('pieHalf');
    this.getGElement('pieLarge1');
    this.getGElement('pieMedium2', 250, 0);
    this.getGElement('pieMedium1', 250, 0);
    this.getGElement('pieSmall1', 218, 0);
    this.getGElement('pieSmall2', 218, 0);
    this.getGElement('pieSmall3', 218, 0);
    // this.getGElement('linearBar');
    this.getGElement('multipleBar');
    // this.getGElement('line');

  },
  methods: {
    updateSVG(chartElement, gElement, width, padding) {
      const gInfo = gElement.getBoundingClientRect();
      const pieInfo = chartElement.getBoundingClientRect();
      const svgElement = chartElement.querySelector("svg");
      const divElement = chartElement.querySelector("div");

      // g标签整体放大，宽度撑满
      const scaleFactor = width / gInfo.width;
      const transformValue = gElement.getAttribute("transform") || "";
      gElement.setAttribute(
          "transform",
          `${transformValue} scale(${scaleFactor})`
      );

      // 文字大小还原
      const textElements = gElement.querySelectorAll("text");
      textElements.forEach((textElement) => {
        const inverseScaleFactor = 1 / scaleFactor;
        const textTransformValue = textElement.getAttribute("transform") || "";
        textElement.setAttribute(
            "transform",
            `${textTransformValue} scale(${inverseScaleFactor})`
        );
      });

      // 宽高适配放大后g标签
      // 宽高适配放大后g标签
      const gInfoNew = chartElement.querySelector("svg g").getBoundingClientRect();

      divElement.style.height = gInfoNew.height - pieInfo.y + gInfoNew.y + 'px';
      divElement.style.width = width * scaleFactor + 50 + 'px';
      svgElement.style.height = gInfoNew.height - pieInfo.y + gInfoNew.y + 'px';
      svgElement.style.width = width * scaleFactor + 50 + 'px';

      // 移动位置及外层高度限制；
      chartElement.style.height = gInfoNew.height + 'px';
      divElement.style.marginLeft = (pieInfo.x - gInfoNew.x + padding) + 'px';
      divElement.style.marginTop = (pieInfo.y - gInfoNew.y) + 'px';
      // }, 100)
    },
    getGElement(refName, width = 670, padding = 40) {
      const chartHalfElement = this.$refs[refName]
      const gElement = chartHalfElement.querySelector("svg g");

      if (!gElement) {
        setTimeout(() => {
          this.getGElement();
        }, 500);
      } else {
        this.updateSVG(chartHalfElement, gElement, width, padding)
      }
    },
    async convertToCanvas() {
      const graphImg = this.$refs.main
      const canvasDom = document.createElement('canvas');

      const w = graphImg.getBoundingClientRect().width;
      const h = graphImg.getBoundingClientRect().height;

      const scaleBy = 3;
      canvasDom.width = w * scaleBy;
      canvasDom.height = h * scaleBy;

      const canvas = await html2canvas(graphImg, {canvas: canvasDom, scale: scaleBy, useCORS: true});

      const url = canvas.toDataURL();

      const fileName = `下载报告${new Date().valueOf()}`;
      downloadFile(url, fileName);
    },

    changeData() {
      this.barChartVertical = {
        data: [
          ['category', 'value123'],
          ['20-29岁', 79.64],
          ['30-39岁', 41.42],
          ['40-49岁', 19.06],
          ['50-59岁', 11.41],
          ['60-69岁', 1.33],
          ['70岁以上', 0.96]
        ],
        color: 2,
        height: 750,
        yStart: 0,
        yEnd: '',
        xRotate: 0,
        xInterval: 0,
        isPercentage: true,
        heading: 'asdfasdfasdfasfd',
        isShowLabel: true,
      }

      this.barChartHorizontal = {
        labelSuffix: '%',
        data: [['总客流人数', 1], ['进店人数', 2.38], ['流人数2', 0.28], ['流人数12121212', 0.18], ['流人数22', 2.08]],
        color: 2,
        text: 'testsetsetest',
        heading: 'asdfasdfasdfasfd',
        isPercentage: true,
        isShowLabel: true
      }

      this.funnelTest = {data: [['总客流人数', 100], ['进店人数', 60], ['流人数112', 30], ['流人数1123123', 15], ['流人数223123123123', 7]]}
      this.progress = {
          value: 0.55,
          leftCornerText: '测试一下',
          rightCornerText: '测试',
        }
      this.heading = {text: '测试一下测试一下测试一下'}
      this.headingOne = {text: '测试一下测试一下测试一下', number: "02"}
    }
  },
  computed: {},
  watch: {},
}

function downloadFile(href, fileName = '报告') {
  const downloadElement = document.createElement('a');
  downloadElement.href = href;
  downloadElement.download = `${fileName}.png`;
  document.body.appendChild(downloadElement);
  downloadElement.click();
  document.body.removeChild(downloadElement);
  window.URL.revokeObjectURL(href);
}

</script>
<style scoped>
/*.chart {*/
/*  height: 750px;*/
/*}*/

.test-main {
  width: 750px;
  height: 100%;
  background-color: #dee2e6;
}

.backIMG {
  /*background: url("../assets/img/test.png") no-repeat right bottom ;*/
}

.chat-swap {
  width: 750px;
  height: 750px;
  background-color: white;
  padding: 0 40px;
  overflow: hidden;
  margin-bottom: 20px;
  border: 1px red solid;
}

.height-320 {
  height: 320px;
}

.height-500 {
  height: 500px;
}

.display-flex {
  display: flex;
  justify-content: space-around;
}

.gap-40 {
  gap: 40px;
}

.gap-20 {
  gap: 20px;
}

.height-fit {
  height: fit-content;
}

.chart-1 {
  width: 327px;
  height: 327px;
  overflow: hidden;
}

.chart-2 {
  width: 218px;
  height: 218px;
  overflow: hidden;
}

.title-swap {
  display: flex;
  gap: 14px;
  justify-items: flex-start;
  align-items: center;
}

.border-new {
  width: 6px;
  height: 32px;
  background: linear-gradient(180deg, #0C69FF 0%, rgba(12, 105, 255, 0.00) 100%);
}

.title {
  font-size: 33px;
  font-family: 'Source Han Sans CN', serif;
  margin: 16px 0 24px 0;
}

</style>
