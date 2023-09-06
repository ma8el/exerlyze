<script setup lang="ts">
import { IonContent, IonIcon, IonLabel, IonItem, IonSelect, IonSelectOption, IonInput, IonButton } from '@ionic/vue'
import { chevronForward, peopleOutline, scaleOutline, swapVerticalOutline } from 'ionicons/icons';
import { useRouter } from 'vue-router';

const router = useRouter()

const onClick = () => {
  console.log('clicked')
}

const onWelcome = () => {
  router.push('tabs/home')
}
</script>

<template>
  <ion-content class="ion-padding">
    <div class="image">
      <img src="../../assets/illustrations/fill_form.svg" alt="">
    </div>
    <div class="name">
      <ion-label class="bold_lbl">Let's complete your profile</ion-label>
      <ion-label class="smpl_lbl">It will help us to know more about you</ion-label>
    </div>
  
      <ion-item lines="none">
        <ion-icon :src="peopleOutline" color="medium" style="margin-right: 10px;"></ion-icon>
        <ion-select value="" :multiple="true" placeholder="Choose Gender">
          <ion-select-option value="male">Male</ion-select-option>
          <ion-select-option value="female">Female</ion-select-option>
        </ion-select>
      </ion-item>
  
      <ion-item lines="none">
        <ion-input type="date" placeholder="Date of birth"></ion-input>
      </ion-item>
  
      <ion-item lines="none">
        <ion-icon :src="scaleOutline" color="medium" style="margin-right: 10px;"></ion-icon>
        <ion-input type="number" placeholder="Your Weight"></ion-input>
        <ion-button @click="onClick()" expand="block" slot="end" shape="round" color="primary">
          KG
        </ion-button>
      </ion-item>
  
      <ion-item lines="none">
        <ion-icon :src="swapVerticalOutline" color="medium" style="margin-right: 10px;"></ion-icon>
        <ion-input type="number" placeholder="Your Height"></ion-input>
        <ion-button @click="onClick()" expand="block" slot="end" shape="round" color="primary">
          CM
        </ion-button>
      </ion-item>
  
      <div class="button">
        <ion-button @click="onWelcome()" expand="block" shape="round">
          Next
          <ion-icon :src="chevronForward" style="margin-left: 10px;"></ion-icon>
        </ion-button>
      </div>
  </ion-content>
</template>

<style scoped lang="scss">
ion-content{
    .image{
        margin-top: 2rem;
        display: flex;
        justify-content: center;
        img{
            height: 300px;
            width: 300px;
        }
    }
    .name{
        display: flex;
        flex-direction: column;
        justify-content: center;
        text-align: center;
        margin-top: 1.5rem;
        .bold_lbl{
            font-size: 24px;
            margin-bottom: 10px;
            span{
                font-size: 44px;
                color: var(--ion-color-primary);
            }
        }
        .smpl_lbl{
            font-size: 14px;
            margin-bottom: 16px;
        }
    }
    ion-item {
        border: 1px solid #92949c2a;
        border-radius: 10px;
        margin-top: 16px;
        ion-input {
            --padding-start: 10px;
        }
    }
    .button{
        margin-top: 1.5rem;
        ion-button{
            height: 50px;
        }
    }
}
</style>