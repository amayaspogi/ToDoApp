<template>
  <nav class="col-md-2 d-none d-md-block bg-light sidebar" v-if="loaded">
    <div class="sidebar-sticky">
      <ul class="nav flex-column">
        <li class="nav-item">
          <router-link :to="{ path: '/dashboard' }" class="nav-link">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="feather feather-home"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Dashboard
          </router-link>
        </li>
        <li class="nav-item">
          <router-link :to="{ path: userProfile }" class="nav-link">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="feather feather-users"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            User Profile
          </router-link>
        </li>
      </ul>
      <ul class="nav flex-column ml-2 mt-2 border-top">
        <li class="nav-item" v-for="item in data.modules" :key="item.name">
          <router-link :to="{ path: item.component }" class="nav-link">{{ item.name }}</router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  props: {
    loaded: Boolean,
    data: {
      modules: Array,
      userType: String,
    },
  },
  computed: {
    userProfile() {
      return `/${this.data.userType}-user/current`;
    },
  },
};
</script>

<style scoped>
.feather {
  width: 16px;
  height: 16px;
  vertical-align: text-bottom;
}

.sidebar {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 100; /* Behind the navbar */
  padding: 0;
  box-shadow: inset -1px 0 0 rgba(0, 0, 0, 0.1);
  font-size: 0.875rem !important;
}

.sidebar-sticky {
  position: -webkit-sticky;
  position: sticky;
  top: 48px; /* Height of navbar */
  height: calc(100vh - 48px);
  padding-top: 0.5rem;
  overflow-x: hidden;
  overflow-y: auto; /* Scrollable contents if viewport is shorter than content. */
}

.sidebar .nav-link {
  font-weight: 500;
  color: #333;
}

.sidebar .nav-link .feather {
  margin-right: 4px;
  color: #999;
}

.sidebar .nav-link.active {
  color: #007bff;
}

.sidebar .nav-link:hover .feather,
.sidebar .nav-link.active .feather {
  color: inherit;
}

.sidebar-heading {
  font-size: 0.75rem;
  text-transform: uppercase;
}
</style>