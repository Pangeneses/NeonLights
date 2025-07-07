import { Routes } from '@angular/router';

/*********** SITE **************/

/************ HOME **************/
import { HeadlinesComponent } from './component/headlinesComponent/headlines.component';

/************ ADMIN **************/

/************ USER **************/

/************ FORUM **************/
import { FIndexComponent } from './component/findexComponent/findex.component';
import { FReaderComponent } from './component/freaderComponent/freader.component';
import { FNewComponent } from './component/fnewComponent/fnew.component';

/************ Journal **************/
import { AIndexComponent } from './component/aindexComponent/aindex.component'
import { AReaderComponent } from './component/areaderComponent/areader.component';
import { ANewComponent } from './component/anewComponent/anew.component';

/************ SHOP **************/
import { FeaturedComponent } from './component/featuredComponent/featured.component';
import { AppComponent } from './app.component';

export const routes: Routes = [
    {
        path: '',
        component: AppComponent,
        children: [
            { path: 'headlines', component: HeadlinesComponent },
            { path: 'findex', component: FIndexComponent },
            { path: 'freader', component: FReaderComponent },
            { path: 'fnew', component: FNewComponent },
            { path: 'aindex', component: AIndexComponent },
            { path: 'areader', component: AReaderComponent },
            { path: 'anew', component: ANewComponent },
            { path: 'featured', component: FeaturedComponent }
        ]
    }
];
