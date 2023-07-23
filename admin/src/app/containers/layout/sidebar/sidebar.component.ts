import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { SidebarService, ISidebar } from './sidebar.service';
import menuItems, { IMenuItem } from 'src/app/constants/menu';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/_services';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit, OnDestroy {
  menuItems: IMenuItem[] = menuItems;
  selectedParentMenu = '';
  viewingParentMenu = '';
  currentUrl: string;
  spinner: string = 'none';
  sidemenu: boolean = false
  sidebar: ISidebar;
  subscription: Subscription;

  constructor(
    private router: Router,
    private sidebarService: SidebarService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthenticationService
  ) {
    this.subscription = this.sidebarService.getSidebar().subscribe(
      res => {
        this.sidebar = res;
      },
      err => {
        console.error(`An error occurred: ${err.message}`);
      }
    );
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map((route) => {
          while (route.firstChild) { route = route.firstChild; }
          return route;
        })
      ).subscribe((event) => {
        const path = this.router.url.split('?')[0];
        const paramtersLen = Object.keys(event.snapshot.params).length;
        const pathArr = path.split('/').slice(0, path.split('/').length - paramtersLen);
        this.currentUrl = pathArr.join('/');
      });

    router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const { containerClassnames } = this.sidebar;
      const toParentUrl = this.currentUrl.split('/').filter(x => x !== '')[1];
      if (toParentUrl !== undefined || toParentUrl !== null) {
        this.selectedParentMenu = toParentUrl.toLowerCase();
      } else {
        this.selectedParentMenu = 'dashboards';
      }
      this.selectMenu();
      this.toggle();
      this.sidebarService.setContainerClassnames(0, containerClassnames, this.sidebar.selectedMenuHasSubItems);
      window.scrollTo(0, 0);
    });
  }

  ngOnInit(): void {
    var currentUser = this.authService.currentUserValue;
    if (currentUser && currentUser.user_details && currentUser.user_details.role == "subadmin" && currentUser.user_details.privileges && currentUser.user_details.privileges.length > 0) {
      let menu = [];
      menu.push(this.menuItems[0]);
      this.menuItems.forEach((value) => {
        let index = currentUser.user_details.privileges.findIndex(x => x.alias == value.id);
        if (index != -1) {
          if (currentUser.user_details.privileges[index].status.view) {
            // value = currentUser.user_details.privileges[index].status.add == true ? value : value
            menu.push(value);
          }
        }
      });
      this.menuItems = menu;
    }
    setTimeout(() => {
      this.selectMenu();
      const { containerClassnames } = this.sidebar;
      const nextClasses = this.getMenuClassesForResize(containerClassnames);
      this.sidebarService.setContainerClassnames(0, nextClasses.join(' '), this.sidebar.selectedMenuHasSubItems);
      this.isCurrentMenuHasSubItem();
    }, 100);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  selectMenu() {
    const currentParentUrl = this.currentUrl.split('/').filter(x => x !== '')[1];
    
    if (currentParentUrl !== undefined || currentParentUrl !== null) {
      this.selectedParentMenu = currentParentUrl.toLowerCase();
      if(  this.selectedParentMenu == 'dashboards'){
        this.viewingParentMenu = '';
        this.sidemenu=false
      }
    } else {
      this.selectedParentMenu = 'dashboards';
      
    }
    this.isCurrentMenuHasSubItem();
  }

  isCurrentMenuHasSubItem() {
    const { containerClassnames } = this.sidebar;
    const menuItem = this.menuItems.find(
      x => x.id === this.selectedParentMenu
    );
    const isCurrentMenuHasSubItem =
      menuItem && menuItem.subs && menuItem.subs.length > 0 ? true : false;
    if (isCurrentMenuHasSubItem !== this.sidebar.selectedMenuHasSubItems) {
      if (!isCurrentMenuHasSubItem) {
        this.sidebarService.setContainerClassnames(0, containerClassnames, false);
      } else {
        this.sidebarService.setContainerClassnames(0, containerClassnames, true);
      }
    }
    return isCurrentMenuHasSubItem;
  }

  changeSelectedParentHasNoSubmenu(parentMenu: string) {
    const { containerClassnames } = this.sidebar;
    this.selectedParentMenu = parentMenu;
    this.viewingParentMenu = parentMenu;
    this.sidebarService.changeSelectedMenuHasSubItems(false);
    this.sidebarService.setContainerClassnames(0, containerClassnames, false);
  }

  openSubMenu(event: { stopPropagation: () => void; }, menuItem: IMenuItem) {
    var side: boolean;
    if (this.sidemenu == false) {
      this.sidemenu = true
      side =true

    } else {
      this.sidemenu = false
        side = false
    }
    if (side) {
      if (event) { event.stopPropagation(); }
      const { containerClassnames, menuClickCount } = this.sidebar;

      const selectedParent = menuItem.id;
      const hasSubMenu = menuItem.subs && menuItem.subs.length > 0;
      this.sidebarService.changeSelectedMenuHasSubItems(hasSubMenu);
      if (!hasSubMenu) {
        this.viewingParentMenu = selectedParent;
        this.selectedParentMenu = selectedParent;
        this.toggle();
      } else {
        const currentClasses = containerClassnames ?
          containerClassnames.split(' ').filter(x => x !== '') :
          '';

        if (!currentClasses.includes('menu-mobile')) {
          if (
            currentClasses.includes('menu-sub-hidden') &&
            (menuClickCount === 2 || menuClickCount === 0)
          ) {
            this.sidebarService.setContainerClassnames(3, containerClassnames, hasSubMenu);
          } else if (
            currentClasses.includes('menu-hidden') &&
            (menuClickCount === 1 || menuClickCount === 3)
          ) {
            this.sidebarService.setContainerClassnames(2, containerClassnames, hasSubMenu);
          } else if (
            currentClasses.includes('menu-default') &&
            !currentClasses.includes('menu-sub-hidden') &&
            (menuClickCount === 1 || menuClickCount === 3)
          ) {
            this.sidebarService.setContainerClassnames(0, containerClassnames, hasSubMenu);
          }
        } else {
          this.sidebarService.addContainerClassname('sub-show-temporary', containerClassnames);
        }
        this.viewingParentMenu = selectedParent;
      }
    } else {
      this.viewingParentMenu = '';
      this.selectMenu();
      this.toggle();
    }

  }

  toggle() {
    const { containerClassnames, menuClickCount } = this.sidebar;
    const currentClasses = containerClassnames.split(' ').filter(x => x !== '');
    if (
      currentClasses.includes('menu-sub-hidden') &&
      menuClickCount === 3
    ) {
      this.sidebarService.setContainerClassnames(2, containerClassnames, this.sidebar.selectedMenuHasSubItems);
    } else if (
      currentClasses.includes('menu-hidden') ||
      currentClasses.includes('menu-mobile')
    ) {
      if (!(menuClickCount === 1 && !this.sidebar.selectedMenuHasSubItems)) {
        this.sidebarService.setContainerClassnames(0, containerClassnames, this.sidebar.selectedMenuHasSubItems);
      }
    }
  }

  getMenuClassesForResize(classes: string) {
    let nextClasses = classes.split(' ').filter((x: string) => x !== '');
    const windowWidth = window.innerWidth;

    if (windowWidth < this.sidebarService.menuHiddenBreakpoint) {
      nextClasses.push('menu-mobile');
    } else if (windowWidth < this.sidebarService.subHiddenBreakpoint) {
      nextClasses = nextClasses.filter((x: string) => x !== 'menu-mobile');
      if (
        nextClasses.includes('menu-default') &&
        !nextClasses.includes('menu-sub-hidden')
      ) {
        nextClasses.push('menu-sub-hidden');
      }
    } else {
      nextClasses = nextClasses.filter((x: string) => x !== 'menu-mobile');
      if (
        nextClasses.includes('menu-default') &&
        nextClasses.includes('menu-sub-hidden')
      ) {
        nextClasses = nextClasses.filter((x: string) => x !== 'menu-sub-hidden');
      }
    }
    return nextClasses;
  }

  @HostListener('document:click', ['$event'])
  handleDocumentClick(event) {
    this.viewingParentMenu = '';
    this.sidemenu=false
    this.selectMenu();
    this.toggle();
  }

  @HostListener('window:resize', ['$event'])
  handleWindowResize(event) {
    if (event && !event.isTrusted) {
      return;
    }
    const { containerClassnames } = this.sidebar;
    const nextClasses = this.getMenuClassesForResize(containerClassnames);
    this.sidebarService.setContainerClassnames(0, nextClasses.join(' '), this.sidebar.selectedMenuHasSubItems);
    this.isCurrentMenuHasSubItem();
  }

  menuClicked(e: MouseEvent) {
    e.stopPropagation();
  }

  pagerouting(href) {
    this.spinner = 'block';
    this.router.navigate([href]);
    setTimeout(() => {
      this.spinner = 'none';
    }, 2000);
  }
  submenuOpen(){
    
    this.sidemenu=false
  }

}
