<template>
  <div
    ref="routeview"
    class="routeview"
  >
    <div class="head">
      <div
        class="back"
        @click="back()"
      >
        <i class="icon iconfont icon-back" />
      </div>
      <div class="input-group">
        <div class="local">
          <label
            for="local"
            class="local-label"
          />
          <input
            id="local"
            v-model="routeMsg.localPosition"
            type="text"
          >
        </div>
        <div class="address">
          <label
            for="address"
            class="address-label"
          />
          <input
            id="address"
            v-model="routeMsg.address"
            type="text"
        ></div>
      </div>
      <div
        ref="reserver"
        class="reserver"
        @click="changeReserver"
      >
        <i class="icon iconfont icon-xianghujiaohuan-reverser" />
      </div>
      <div
        class="search"
        @click="search"
      >搜索</div>
    </div>
    <div
      id="allmap"
      ref="map"
      class="allmap"
    />
    <div class="footer">
      <div
        :class="{isActive:activeIndex==0}"
        class="footer-item"
        @click="searchRoute(0)"
      >
        <div>最少时间</div>
        <div class="time">{{ routeTimeMsg[0]?routeTimeMsg[0].time:'' }}</div>
        <div>{{ routeTimeMsg[0]?routeTimeMsg[0].distance:'' }}</div>
      </div>
      <div
        :class="{isActive:activeIndex==1}"
        class="footer-item"
        @click="searchRoute(1)"
      >
        <div>最短距离</div>
        <div class="time">{{ routeTimeMsg[1]?routeTimeMsg[1].time:'' }}</div>
        <div>{{ routeTimeMsg[1]?routeTimeMsg[1].distance:'' }}</div>
      </div>
      <div
        :class="{isActive:activeIndex==2}"
        class="footer-item"
        @click="searchRoute(2)"
      >
        <div>避开高速</div>
        <div class="time">{{ routeTimeMsg[2]?routeTimeMsg[2].time:'' }}</div>
        <div>{{ routeTimeMsg[2]?routeTimeMsg[2].distance:'' }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      map: undefined,
      routeTimeMsg: [],
      activeIndex: 0,
      reserver: false
    };
  },
  computed: {
    ...mapGetters(["routeMsg"])
  },
  mounted() {
    setTimeout(() => {
      this.$refs.map.style.height =
        this.$refs.routeview.offsetHeight - 60 - 80 + "px";
      this.initMap();
      this.getPosition();
    }, 20);
  },
  methods: {
    initMap() {
      var map = new BMap.Map("allmap"); // 创建Map实例
      this.map = map;
      map.centerAndZoom(new BMap.Point(116.404, 39.915), 11); // 初始化地图,设置中心点坐标和地图级别
      // 控件初始化
      this.addControlMap(map);
    },
    getPosition() {
      var _this = this;
      var geolocation = new BMap.Geolocation();
      geolocation.getCurrentPosition(
        function(r) {
          if (this.getStatus() == BMAP_STATUS_SUCCESS) {
            _this.routeMsg.localPosition =
              r.address.province +
              r.address.city +
              r.address.district +
              r.address.street +
              r.address.street_number;
            _this.routeMsg.localPositionPoint = r.point;
            _this.searchRoute(0);
            _this.routeTime(_this.map);
          } else {
            alert("failed" + this.getStatus());
          }
        },
        { enableHighAccuracy: true }
      );
    },
    addControlMap(map) {
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
        console.log("over");
      });
      geolocationControl.addEventListener("locationError", function(e) {
        alert(e.message);
      });
      map.addControl(geolocationControl);
    },
    searchRoute(i) {
      var _this = this;
      _this.activeIndex = i;
      var startPoint = this.routeMsg.localPositionPoint;
      var endPoint = this.routeMsg.addressPoint;
      var routePolicy = [
        BMAP_DRIVING_POLICY_LEAST_TIME,
        BMAP_DRIVING_POLICY_LEAST_DISTANCE,
        BMAP_DRIVING_POLICY_AVOID_HIGHWAYS
      ];
      _this.map.clearOverlays();
      search(startPoint, endPoint, routePolicy[i]);
      function search(startPoint, endPoint, route) {
        var driving = new BMap.DrivingRoute(_this.map, {
          renderOptions: { map: _this.map, autoViewport: true },
          policy: route
        });
        driving.search(startPoint, endPoint);
      }
    },
    routeTime(map) {
      var _this = this;
      _this.routeTimeMsg = [];
      var startPoint = this.routeMsg.localPositionPoint;
      var endPoint = this.routeMsg.addressPoint;
      var routePolicy = [
        BMAP_DRIVING_POLICY_LEAST_TIME,
        BMAP_DRIVING_POLICY_LEAST_DISTANCE,
        BMAP_DRIVING_POLICY_AVOID_HIGHWAYS
      ];
      for (let i = 0; i < 3; i++) {
        search(startPoint, endPoint, i);
      }
      function search(startPoint, endPoint, i) {
        var options = {
          onSearchComplete: function(results) {
            if (driving.getStatus() != BMAP_STATUS_SUCCESS) {
              return;
            }
            var output = {};
            var plan = results.getPlan(0);
            output.time = plan.getDuration(true); //获取时间
            output.distance = plan.getDistance(true); //获取距离
            _this.routeTimeMsg.push(output);
          },
          policy: routePolicy[i]
        };
        var driving = new BMap.DrivingRoute(map, options);
        driving.search(startPoint, endPoint);
      }
    },
    back() {
      this.$router.back();
    },
    changeReserver() {
      if (this.reserver) {
        this.$refs.reserver.style.transform = `rotate(0deg)`;
      } else {
        this.$refs.reserver.style.transform = `rotate(180deg)`;
      }
      let tempPoint = new BMap.Point(
        this.routeMsg.addressPoint.lng,
        this.routeMsg.addressPoint.lat
      );
      let tempaddress = this.routeMsg.address;
      this.routeMsg.address = this.routeMsg.localPosition;
      this.routeMsg.addressPoint = new BMap.Point(
        this.routeMsg.localPositionPoint.lng,
        this.routeMsg.localPositionPoint.lat
      );
      this.routeMsg.localPosition = tempaddress;
      this.routeMsg.localPositionPoint = tempPoint;
      this.reserver = !this.reserver;
      console.log(this.routeMsg);
      this.searchRoute(0);
      this.routeTime(this.map);
    },
    search: async function() {
      await this.getGeocoder(
        this.routeMsg.address,
        this.routeMsg.addressPoint,
        0
      );
      await this.getGeocoder(
        this.routeMsg.localPosition,
        this.routeMsg.localPositionPoint,
        1
      );
      this.searchRoute(0);
      this.routeTime(this.map);
    },
    getGeocoder: function(address, addressPoint, i) {
      //地址解析
      var _this = this;
      return new Promise((resolve, reject) => {
        var myGeo = new BMap.Geocoder();
        // 将地址解析结果显示在地图上,并调整地图视野
        myGeo.getPoint(address, function(point) {
          if (point) {
            if (i == 0) {
              _this.routeMsg.addressPoint = point;
            } else {
              _this.routeMsg.localPositionPoint = point;
            }
            resolve();
          } else {
            alert("您选择地址没有解析到结果!");
            reject();
          }
        });
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'

.routeview
  width 100%
  height 100%

  .head
    height 60px
    display flex
    box-shadow 0px 3px 6px rgba(0, 0, 0, 0.5)

    .back
      line-height 60px
      text-align center
      flex-grow 1

      i
        font-size 26px

    .input-group
      div
        height 30px
        line-height 30px
        padding 0 10px

        input
          outline 0
          appearance none
          font-size 14px
          letter-spacing 2px

      .local
        border-bottom 1px solid #eee

        label
          display inline-block
          width 4px
          height 4px
          background-color #2ae42f
          border-radius 50%
          vertical-align middle

      .address label
        display inline-block
        width 4px
        height 4px
        background-color #fd3346
        border-radius 50%
        vertical-align middle

    .reserver
      line-height 60px
      text-align center
      flex-grow 1
      transition all 0.5s

      i
        font-size 20px

    .search
      line-height 60px
      text-align center
      font-size 14px
      flex-grow 1

  .footer
    height 80px
    display flex

    .isActive
      color $color-theme
      background-color #eee

    .footer-item
      text-align center
      flex-grow 1

      div
        height 26px
        line-height 26px
        font-size 14px

      .time
        font-size 18px
</style>