import { Component, OnInit } from '@angular/core';
import { DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.page.html',
  styleUrls: ['./documents.page.scss'],
})
export class DocumentsPage implements OnInit {

  pdfLink:any;
  constructor(private sanitizer: DomSanitizer) { 
    this.pdfLink = this.sanitizer.bypassSecurityTrustResourceUrl('https://om.ecrm.edf-re.com/functionaldocumentcontrolctr/DocsFunctional/5395-00%20GE%201XMW%20Annual%20Maintenance.pdf');
  }

  ngOnInit() {
  }

}
