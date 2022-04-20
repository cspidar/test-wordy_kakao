<script>
  import { quintOut } from "svelte/easing";
  import { fly, fade, slide, crossfade } from "svelte/transition";
  import { flip } from "svelte/animate";
  import { onMount, afterUpdate, beforeUpdate } from "svelte";

  import {
    icon_refresh,
    icon_list,
    icon_menu,
    icon_yet,
    icon_know,
  } from "./lib/icons.js";
  import { btnStyle, subBtnStyle, footBtnStyle } from "./lib/style.js";
  import { ori_items } from "./lib/word/wordList_endGame.js";
  import InfiniteScroll from "./com/InfiniteScroll.svelte";
  import Icon from "./com/Icon.svelte";

  import Drawer from "svelte-drawer-component";
  import DrawerTitle from "./com/DrawerTitle.svelte";
  import DrawerMenu from "./com/DrawerMenu.svelte";
  import RotateButton from "./com/RotateButton.svelte";

  // LINK

  import "./kakao.js";
  // import "https://developers.kakao.com/sdk/js/kakao.js";

  // Kakao.init("6e437b23b2779fece18e6c86a9b86bb7");
  // console.log(Kakao.isInitialized());

  // import "./kakao.js";
  // import * as Kakao from "./kakao.js";
  // let kakao = Kakao;
  // Kakao.init("6e437b23b2779fece18e6c86a9b86bb7");
  // console.log(Kakao.isInitialized());

  //함수로 감싸야만 하는 이유, 아니면 안싸도 되는 방법 등 조사 필요
  function shareKakao() {
    Kakao.Link.sendDefault({
      objectType: "feed",
      content: {
        title: "오늘의 디저트",
        description: "아메리카노, 빵, 케익",
        imageUrl:
          "https://mud-kage.kakao.com/dn/NTmhS/btqfEUdFAUf/FjKzkZsnoeE4o19klTOVI1/openlink_640x640s.jpg",
        link: {
          mobileWebUrl: "https://developers.kakao.com",
          androidExecutionParams: "test",
        },
      },
      itemContent: {
        profileText: "Kakao",
        profileImageUrl:
          "https://mud-kage.kakao.com/dn/Q2iNx/btqgeRgV54P/VLdBs9cvyn8BJXB3o7N8UK/kakaolink40_original.png",
        titleImageUrl:
          "https://mud-kage.kakao.com/dn/Q2iNx/btqgeRgV54P/VLdBs9cvyn8BJXB3o7N8UK/kakaolink40_original.png",
        titleImageText: "Cheese cake",
        titleImageCategory: "Cake",
        items: [
          {
            item: "Cake1",
            itemOp: "1000원",
          },
          {
            item: "Cake2",
            itemOp: "2000원",
          },
          {
            item: "Cake3",
            itemOp: "3000원",
          },
          {
            item: "Cake4",
            itemOp: "4000원",
          },
          {
            item: "Cake5",
            itemOp: "5000원",
          },
        ],
        sum: "총 결제금액",
        sumOp: "15000원",
      },
      social: {
        likeCount: 10,
        commentCount: 20,
        sharedCount: 30,
      },
      buttons: [
        {
          title: "웹으로 이동",
          link: {
            mobileWebUrl: "https://developers.kakao.com",
          },
        },
        {
          title: "앱으로 이동",
          link: {
            mobileWebUrl: "https://developers.kakao.com",
          },
        },
      ],
    });
  }
  // LINK

  export let tabs = [
    { label: "Checks", icon: icon_list, value: 1 },
    { label: "Yets", icon: icon_yet, value: 2 },
    { label: "Knows", icon: icon_know, value: 3 },
  ];

  export let activeTabValue = 1;
  export let tabRight = true;
  export const handleClick = (tabValue) => {
    tabValue > activeTabValue ? (tabRight = true) : (tabRight = false);
    if (tabValue === 2) {
      curr_yets = JSON.parse(localStorage.getItem("yets"));
      yets_scroll();
    }
    if (tabValue !== 2) {
      show_yets = [];
      update_show_yets = [];
      show_yet_page = 0;
    }
    if (tabValue === 3) {
      curr_knows = JSON.parse(localStorage.getItem("knows"));
      knows_scroll();
    }
    if (tabValue !== 3) {
      show_knows = [];
      update_show_knows = [];
      show_know_page = 0;
    }

    return (activeTabValue = tabValue);
  };

  export let fullList = JSON.parse(JSON.stringify(ori_items)); // 깊은 복사
  export let checks = [];

  // 무한 스크롤
  export let yets = [];
  let show_yet_page = 0;
  let show_yet_size = 20;
  let show_yets = [];
  let update_show_yets = [];
  let curr_yets = [];
  function yets_scroll() {
    update_show_yets = curr_yets.slice(
      show_yet_page * show_yet_size,
      (show_yet_page + 1) * show_yet_size
    );
  }
  $: show_yets = [...show_yets, ...update_show_yets];

  export let knows = [];
  let show_know_page = 0;
  let show_know_size = 60;
  let show_knows = [];
  let update_show_knows = [];
  let curr_knows = [];
  function knows_scroll() {
    update_show_knows = curr_knows.slice(
      show_know_page * show_know_size,
      (show_know_page + 1) * show_know_size
    );
  }
  $: show_knows = [...show_knows, ...update_show_knows];

  export let selected;

  // Save
  $: localStorage.setItem("fullList", fullList.length);
  $: localStorage.setItem("yets", JSON.stringify(yets));
  $: localStorage.setItem("knows", JSON.stringify(knows));

  // Refresh
  function refreshList() {
    fullList = JSON.parse(JSON.stringify(ori_items)); // 깊은 복사
    checks = [];
    knows = [];
    yets = [];
    fillChecks();
  }

  // Fill checks
  function fillChecks() {
    for (let i = 0; i < 10; i++) {
      checks.push(fullList.shift());
    }
    selected = checks[0].word;
  }

  // Load
  function loadStatus() {
    try {
      let chkYets = JSON.parse(localStorage.getItem("yets"));
      let chkKnows = JSON.parse(localStorage.getItem("knows"));
      if (
        // 1 + 1 ===
        // 2
        (chkKnows === null || chkKnows === undefined) &&
        (chkYets === null || chkYets === undefined)
      ) {
        refreshList();
      } else {
        knows = chkKnows;
        yets = chkYets;
        fullList = fullList.slice(knows.length + yets.length, fullList.length);
        fillChecks();
      }
    } catch (e) {
      console.error(e);
    }
  }
  loadStatus();

  // 상태 업데이트를 위한 재할당 및 함수 분리
  function updateKnows() {
    let toKnow = checks.shift();
    knows = [...knows, toKnow];
    let toCheck = fullList.shift();
    checks = [...checks, toCheck];
    selected = checks[0].word;
  }
  function updateYets() {
    let toYet = checks.shift();
    yets = [...yets, toYet];
    let toCheck = fullList.shift();
    checks = [...checks, toCheck];
    selected = checks[0].word;
  }
  function updateYetToKnows(index) {
    let toKnow = show_yets[index];
    knows = [...knows, toKnow];
    let yets1 = yets.slice(0, index);
    let yets2 = yets.slice(index + 1);
    yets = [...yets1, ...yets2];
    show_yets.splice(index, 1);
  }
  function updateKnowsToYet(index) {
    let toYet = show_knows[index];
    yets = [...yets, toYet];
    let knows1 = knows.slice(0, index);
    let knows2 = knows.slice(index + 1);
    knows = [...knows1, ...knows2];
    show_knows.splice(index, 1);
  }

  // 버튼 상태
  let yetBtnStatus = {};
  function yetBtnToggle(index) {
    !yetBtnStatus[index]
      ? (yetBtnStatus[index] = true)
      : (yetBtnStatus[index] = false);
  }
  let knowBtnStatus = {};
  function knowBtnToggle(index) {
    !knowBtnStatus[index]
      ? (knowBtnStatus[index] = true)
      : (knowBtnStatus[index] = false);
  }

  onMount(() => {
    // kakao = Kakao;
    Kakao.init("6e437b23b2779fece18e6c86a9b86bb7");
    console.log(Kakao.isInitialized());
    console.log("mount!1");
  });

  // Drawer Open
  let open = false;
</script>

<!-- LINK -->

<!-- <DrawerMenu /> -->

<Drawer size="22rem" {open} on:clickAway={() => (open = false)}>
  <DrawerTitle>
    <p slot="title">Wordy: movies</p>
    <span slot="btn" on:click={() => (open = false)}>
      <Icon icon={icon_menu} />
    </span>
  </DrawerTitle>

  <div class="absolute top-20 left-8 space-y-4">
    <DrawerMenu>Compo menu 4</DrawerMenu>
    <DrawerMenu>
      <button on:click={refreshList}>
        <Icon icon={icon_refresh} />
        초기화
      </button>
    </DrawerMenu>
    <DrawerMenu>Compo menu 2</DrawerMenu>
    <DrawerMenu>Compo menu 3</DrawerMenu>
    <DrawerMenu>Compo menu 4</DrawerMenu>

    <!-- LINK -->
    <!-- 공유하기 버튼을 추가하고 메시지 보내기 -->
    <button on:click={shareKakao}>
      <img
        src="https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_medium.png"
        alt="카카오링크 보내기 버튼"
      />
    </button>
    <!-- <button on:click={shareKakao}>
      <img
        src="https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_medium.png"
        alt="카카오링크 보내기 버튼"
      />
    </button> -->

    <!-- LINK -->
  </div>
  <div class="absolute bottom-2 right-4">version 1.0.0</div>
</Drawer>

<div class="topTabs w-screen fixed top-0 left-0 right-0 z-50 ">
  <ul class="justify-center mt-2 text-l text-slate-700 ">
    <RotateButton>
      <button on:click={() => (open = true)}>
        <Icon icon={icon_menu} />
      </button>
    </RotateButton>

    {#each tabs as tab}
      <li class={activeTabValue === tab.value ? "active" : ""}>
        <span class="tabs" on:click={handleClick(tab.value)}>
          <Icon icon={tab.icon} />
          {tab.label}
        </span>
      </li>
    {/each}
  </ul>
</div>

<!-- // -->

<div class="mb-14">
  {#each tabs as tab}
    {#if activeTabValue == tab.value}
      <div
        class="pt-9"
        in:fly={tabRight
          ? {
              delay: 0,
              duration: 300,
              x: 500,
              opacity: 1,
              easing: quintOut,
            }
          : {
              delay: 0,
              duration: 300,
              x: -500,
              opacity: 1,
              easing: quintOut,
            }}
      >
        <div class="grid pt-4 h-full break-words">
          <!-- Tab1 -->
          {#if tab.value === 1}
            <div class="tab1Page px-4 pt-4 space-y-2">
              <div class="grid mb-4 ">
                {#each checks as check, i (check)}
                  <div in:slide>
                    <div class="block text-left " transition:slide|local>
                      <div class="mb-2">
                        <div
                          class="flex {btnStyle} grid text-lg drop-shadow-md {i ===
                          0
                            ? 'bg-slate-100 text-slate-900 border-slate-700 border FirstChkItem'
                            : ''}"
                          in:fly|local={{ duration: 300 }}
                          out:fade|local={{ duration: 100 }}
                        >
                          <div
                            class="mb-2 font-semibold text-xl border-b-2 {i ===
                            0
                              ? 'border-b-slate-700'
                              : ''}"
                          >
                            {check.word}
                          </div>

                          {#each check.time as examNum, j (examNum)}
                            <div
                              class="text-sm my-2 font-normal border-b-2 {i ===
                              0
                                ? 'border-b-slate-400'
                                : ''}"
                            >
                              {check.en[j]}
                            </div>
                          {/each}
                        </div>
                      </div>
                    </div>
                  </div>
                {/each}
              </div>
            </div>
          {/if}
          {#if tab.value === 1}
            <div>
              <div
                class="fixed inset-x-0 bottom-0 w-screen backdrop-blur  items-center border-t-2"
              >
                <div class="text-slate-700 text-center font-semibold mt-1">
                  total: {fullList.length + checks.length} / {ori_items.length},
                  knows: {knows.length}, yets: {yets.length}
                </div>
                <div class="grid grid-flow-row auto-rows-max">
                  <button
                    on:click={updateKnows}
                    class="{subBtnStyle} mx-4 mb-1 mt-2 block"
                    >I know <span
                      class="inline-block text-2xl py-3 animate-bounce"
                      >{selected}</span
                    > !</button
                  >
                  <button
                    on:click={updateYets}
                    class="{subBtnStyle} mx-4 my-1 mb-2 py-3 block"
                    >not yet...</button
                  >
                </div>
              </div>
            </div>
          {/if}
          <!-- Tab1 -->

          <!-- Tab2 -->
          {#if tab.value === 2}
            <div class="tab2Page px-4">
              <div class="grid pt-2 mb-4 ">
                {#each show_yets as yet, i (yet)}
                  <div in:slide>
                    <div class="block text-left " transition:slide|local>
                      <div class="mb-2">
                        <div
                          class="{btnStyle} py-3 grid text-lg"
                          in:fly|local={{ duration: 300 }}
                          out:fade|local={{ duration: 100 }}
                        >
                          <button
                            class="text-left w-full"
                            on:click={() => {
                              yetBtnToggle(i);
                            }}
                          >
                            <div class="font-semibold text-xl border-b-2">
                              {yet.word}
                            </div>

                            {#each yet.time as examNum, j (examNum)}
                              <div class="text-xs mb-1 pt-3 font-normal">
                                {yet.time[j]}
                              </div>
                              <div
                                class="text-sm mb-2 font-semibold border-b-2"
                              >
                                {yet.en[j]}
                              </div>
                              <div
                                class="text-sm mt-0 mb-1 pl-2 font-normal border-b-2"
                              >
                                {yet.ko[j]}
                              </div>
                            {/each}
                            <div class="space-y-2 mt-2 text-center">
                              {#if yetBtnStatus[i]}
                                <div transition:slide|local={{ duration: 200 }}>
                                  <div
                                    class="{subBtnStyle} text-base py-1"
                                    on:click={updateYetToKnows(i)}
                                  >
                                    I know!
                                  </div>
                                </div>
                                <!-- <div transition:slide|local={{ duration: 200 }}>
                                  <div class="{subBtnStyle} text-base py-1">
                                    sound like...
                                  </div>
                                </div> -->
                              {/if}
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                {/each}
              </div>
              <InfiniteScroll
                hasMore={update_show_yets.length}
                threshold={80}
                on:loadMore={() => {
                  show_yet_page++;
                  yets_scroll();
                }}
              />
            </div>
          {/if}

          <!-- Tab3 -->
          {#if tab.value === 3}
            <div class="tab3Page px-4">
              <div class="pt-2 mb-4">
                <div class="grid grid-cols-2 gap-2 text-lg">
                  {#each show_knows as know, i (know)}
                    <div>
                      <div class="block text-left " transition:slide>
                        <div
                          class="flex {btnStyle} "
                          in:fly|local={{ duration: 300 }}
                          out:fade|local={{ duration: 100 }}
                        >
                          <button
                            class="text-left w-full"
                            transition:slide|local
                            on:click={() => {
                              knowBtnToggle(i);
                            }}
                          >
                            <div class="font-semibold text-xl border-b-2">
                              {know.word}
                            </div>
                            <div class="space-y-2 mt-2 text-center">
                              {#if knowBtnStatus[i]}
                                <div transition:slide|local>
                                  <div
                                    class="{subBtnStyle} text-base py-1"
                                    on:click={updateKnowsToYet(i)}
                                  >
                                    not yet...
                                  </div>
                                </div>
                                <!-- <div transition:slide|local>
                                  <div class="{subBtnStyle} text-base py-1">
                                    sound like...
                                  </div>
                                </div> -->
                              {/if}
                            </div></button
                          >
                          <!-- {#each know.time as examNum, j (examNum)}
                    <div class="text-sm my-2 font-normal border-b-2">
                      {know.en[j]}
                    </div>
                  {/each} -->
                        </div>
                      </div>
                    </div>
                  {/each}
                </div>
              </div>
              <InfiniteScroll
                hasMore={update_show_knows.length}
                threshold={80}
                on:loadMore={() => {
                  show_know_page++;
                  knows_scroll();
                }}
              />
            </div>
          {/if}
        </div>
      </div>
    {/if}
  {/each}
</div>

<style>
  /* Tabs */
  .mainBody {
    margin-bottom: 10px;
    padding-top: 40px;
    padding-bottom: 40px;
    /* border: 1px solid #dee2e6; */
    border-radius: 0 0 0.5rem 0.5rem;
    border-top: 0;
  }
  ul {
    display: flex;
    flex-wrap: wrap;
    padding-left: 0;
    margin-bottom: 0;
    list-style: none;
    border-bottom: 1px solid #dee2e6;
  }
  li {
    width: 29vw;
    margin-bottom: -1px;
    text-align: center;
    font-weight: 700;
    font-size: 0.9rem;
  }
  /* .topTabs {
    overflow-x: hidden;
    overflow-y: hidden;
  } */
  span.tabs {
    border: 1px solid transparent;
    border-top-left-radius: 0.25rem;
    border-top-right-radius: 0.25rem;
    display: block;
    padding: 0.5rem 1rem;
    cursor: pointer;
  }
  span.tabs:hover {
    border-color: #e9ecef #e9ecef #dee2e6;
  }

  li.active > span.tabs {
    color: #495057;
    background-color: #fff;
    border-color: #dee2e6 #dee2e6 #fff;
  }
  @keyframes bounce {
    0%,
    100% {
      transform: translateY(-12%);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    50% {
      transform: translateY(+5%);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
  }
  .animate-bounce {
    animation: bounce 0.7s infinite;
  }

  .tab1Page {
    overflow: hidden;
  }
  .tab2Page,
  .tab3Page {
    overflow-y: scroll;
    height: 94vh;
    padding-top: 1vh;
    padding-bottom: 5vh;
  }
  .ChkItem {
    border: 2px;
  }
</style>
