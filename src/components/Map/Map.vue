<template>
  <div class="map">
    <div
      id="r-result"
      class="searchBar"
    >
      <input
        id="suggestId"
        ref="addressinput"
        placeholder="搜索"
        type="text"
      >
      <div
        id="searchResultPanel"
        style="border:1px solid #C0C0C0;width:150px;height:auto; display:none;"
      />
    </div>
    <router-link 
      to="/RouteView"
      class="routeview">
      <p class="icon">
        <i class="icon iconfont icon-daohang-tianchong" />
      </p>
      <p class="text">路线</p>
    </router-link>
    <div id="allmap" />
  </div>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      address: "",
      addressPoint: undefined,
      hasBoundary: false,
      map: undefined,
      localPosition: undefined,
      localPositionPoint: undefined
    };
  },
  mounted() {
    setTimeout(() => {
      this.initMap();
    }, 20);
  },
  methods: {
    initMap() {
      this.address = this.$route.query.address;
      var map = new BMap.Map("allmap");
      this.map = map;
      // 去除input焦点
      map.addEventListener("touchstart", () => {
        this.$refs.addressinput.blur();
      });
      // 搜索初始化
      this.search(map);
      // 控件初始化
      this.addControlMap(map);
      // 区域初始化
      this.getBoundaryMap(map);
    },
    addControlMap(map) {
      var _this = this;
      // 缩放控件
      var navigation = new BMap.NavigationControl({
        anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
        type: BMAP_NAVIGATION_CONTROL_SMALL,
        enableGeolocation: true
      });
      map.addControl(navigation);
      // 定位控件
      var geolocationControl = new BMap.GeolocationControl();
      geolocationControl.addEventListener("locationSuccess", function(e) {
        var address = "";
        address += e.addressComponent.province;
        address += e.addressComponent.city;
        address += e.addressComponent.district;
        address += e.addressComponent.street;
        address += e.addressComponent.streetNumber;
        _this.localAddress = address;
        _this.localPositionPoint = e.point;
      });
      geolocationControl.addEventListener("locationError", function(e) {
        alert(e.message);
      });
      map.addControl(geolocationControl);
      // 地图切换控件
      var mapType1 = new BMap.MapTypeControl({
        mapTypes: [BMAP_NORMAL_MAP, BMAP_HYBRID_MAP],
        anchor: BMAP_ANCHOR_TOP_LEFT
      });
      map.addControl(mapType1); //2D图，卫星图
    },
    getGeocoder(map) {
      //地址解析
      var _this = this;
      var myGeo = new BMap.Geocoder();
      // 将地址解析结果显示在地图上,并调整地图视野
      myGeo.getPoint(this.address, function(point) {
        if (point) {
          _this.addressPoint = point;
          if (!_this.hasBoundary) {
            map.centerAndZoom(point, 14);
          }
          map.addOverlay(new BMap.Marker(point));
        } else {
          alert("您选择地址没有解析到结果!");
        }
      });
    },
    getBoundaryMap(map) {
      // 区域解析
      var _this = this;
      var bdary = new BMap.Boundary();
      bdary.get(this.address, function(rs) {
        var count = rs.boundaries.length;
        if (count === 0) {
          _this.getGeocoder(map);
          return;
        }
        _this.hasBoundary = true;
        var pointArray = [];
        for (var i = 0; i < count; i++) {
          var ply = new BMap.Polygon(rs.boundaries[i], {
            strokeWeight: 2,
            strokeColor: "#ff0000"
          }); //建立多边形覆盖物
          map.addOverlay(ply); //添加覆盖物
          pointArray = pointArray.concat(ply.getPath());
        }
        // 添加中心点 不移动
        _this.getGeocoder(map);
        map.setViewport(pointArray); //调整视野
      });
    },
    search(map) {
      function G(id) {
        return document.getElementById(id);
      }
      var ac = new BMap.Autocomplete({
        //建立一个自动完成的对象
        input: "suggestId",
        location: map
      });

      ac.addEventListener("onhighlight", function(e) {
        //鼠标放在下拉列表上的事件
        var str = "";
        var _value = e.fromitem.value;
        var value = "";
        if (e.fromitem.index > -1) {
          value =
            _value.province +
            _value.city +
            _value.district +
            _value.street +
            _value.business;
        }
        str =
          "FromItem<br />index = " +
          e.fromitem.index +
          "<br />value = " +
          value;

        value = "";
        if (e.toitem.index > -1) {
          _value = e.toitem.value;
          value =
            _value.province +
            _value.city +
            _value.district +
            _value.street +
            _value.business;
        }
        str +=
          "<br />ToItem<br />index = " +
          e.toitem.index +
          "<br />value = " +
          value;
        G("searchResultPanel").innerHTML = str;
      });

      var myValue;
      ac.addEventListener("onconfirm", function(e) {
        //鼠标点击下拉列表后的事件
        var _value = e.item.value;
        myValue =
          _value.province +
          _value.city +
          _value.district +
          _value.street +
          _value.business;
        G("searchResultPanel").innerHTML =
          "onconfirm<br />index = " +
          e.item.index +
          "<br />myValue = " +
          myValue;
        setPlace();
      });

      function setPlace() {
        map.clearOverlays(); //清除地图上所有覆盖物
        function myFun() {
          var pp = local.getResults().getPoi(0).point; //获取第一个智能搜索的结果
          map.centerAndZoom(pp, 18);
          map.addOverlay(new BMap.Marker(pp)); //添加标注
        }
        var local = new BMap.LocalSearch(map, {
          //智能搜索
          onSearchComplete: myFun
        });
        local.search(myValue);
      }
    },
    ...mapMutations({
      setRouteMsg: "SET_ROUTEMSG_MUTATION"
    })
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === "RouteView") {
      this.setRouteMsg({
        address: this.address,
        addressPoint: this.addressPoint,
        localPosition: this.localPosition,
        localPositionPoint: this.localPositionPoint
      });
    }
    next();
  }
};
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'

div.BMap_scaleCtrl.BMap_noprint.anchorTL
  left 10px !important

.map
  width 100%
  height 100%

  .searchBar
    position fixed
    top 40px
    left 0
    width 100%
    height 40px
    box-sizing border-box
    padding 10px 15px
    z-index 999

    input
      display block
      width 100%
      height 32px
      line-height 32px
      padding 0 20px
      border-radius 2px
      box-sizing border-box
      outline 0
      border 1px solid #bfcbd9
      transition 0.5s border-color
      appearance none

      &:focus
        border-color #20a0ff

  .routeview
    position fixed
    bottom 10px
    left 50%
    z-index 999
    width 60px
    height 60px
    background-color $color-theme
    border-radius 50%
    text-align center
    transform translateX(-50%)
    box-shadow 2px 2px 4px rgba(0, 0, 0, 0.4)
    color #fff

    .icon
      margin-top 12px

      i
        font-size 22px

    .text
      margin-top 6px
      font-size 12px

  #allmap
    width 100%
    height 100%
</style>