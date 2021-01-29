<template>
  <v-app>
    <div class="text-center">
      <h1>Welcome to the HTW: News List</h1>
    </div>

    <v-container class="hidden-md-and-down">
      <v-row no-gutters>
        <v-col cols="12" sm="4">
          <v-container>
            <v-col>
              <v-row justify="center">
                <div>
                  <v-avatar color="primary" size="100"></v-avatar>
                </div>
              </v-row>

              <v-row>
                <div class="text-center">
                  <h3>WHAT</h3>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Morbi id dolor interdum, porta arcu in, laoreet mi.
                  </p>
                </div>
              </v-row>
            </v-col>
          </v-container>
        </v-col>

        <v-col cols="12" sm="4">
          <v-container>
            <v-col>
              <v-row justify="center" align="center">
                <div>
                  <v-avatar color="primary" size="100"></v-avatar>
                </div>
              </v-row>

              <v-row>
                <div class="text-center">
                  <h3>WE</h3>
                  <p>
                    Maecenas dictum a ante non rhoncus. Suspendisse tempus
                    consectetur ligula, ut pharetra est porta sed.
                  </p>
                </div>
              </v-row>
            </v-col>
          </v-container>
        </v-col>

        <v-col cols="12" sm="4">
          <v-container>
            <v-col>
              <v-row justify="center">
                <div>
                  <v-avatar color="primary" size="100"></v-avatar>
                </div>
              </v-row>

              <v-row>
                <div class="text-center">
                  <h3>DO</h3>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Donec nec felis posuere, fermentum neque eu, fermentum
                    massa.
                  </p>
                </div>
              </v-row>
            </v-col>
          </v-container>
        </v-col>
      </v-row>
    </v-container>

    <v-container class="hidden-md-and-up">
      <v-col no-gutters>
        <v-row cols="12" sm="4">
          <v-container>
            <v-row align="center">
              <v-col cols="4">
                <div align="center">
                  <v-avatar color="primary" size="75"></v-avatar>
                </div>
              </v-col>

              <v-col cols="8">
                <div class="text-left">
                  <h3>WHAT</h3>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Morbi id dolor interdum, porta arcu in, laoreet mi.
                  </p>
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-row>

        <v-row cols="12" sm="4">
          <v-container>
            <v-row align="center">
              <v-col cols="4">
                <div align="center">
                  <v-avatar color="primary" size="75"></v-avatar>
                </div>
              </v-col>

              <v-col cols="8">
                <div class="text-left">
                  <h3>WE</h3>
                  <p>
                    Maecenas dictum a ante non rhoncus. Suspendisse tempus
                    consectetur ligula, ut pharetra est porta sed.
                  </p>
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-row>

        <v-row cols="12" sm="4">
          <v-container fill-height>
            <v-row align="center">
              <v-col cols="4">
                <div align="center">
                  <v-avatar color="primary" size="75"></v-avatar>
                </div>
              </v-col>

              <v-col cols="8">
                <div class="text-left">
                  <h3>DO</h3>
                  <p>
                    Maecenas dictum a ante non rhoncus. Suspendisse tempus
                    consectetur ligula, ut pharetra est porta sed.
                  </p>
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-row>
      </v-col>
    </v-container>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({})
</script>
